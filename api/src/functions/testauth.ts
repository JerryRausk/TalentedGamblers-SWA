import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";
import { itemTypes } from "../itemTypes";
const TOKENHEADERNAME = "X-App-Authorization";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;
type User = {email: string, name: string}


async function getUserInfoFromIssuer(token: string) {
    const USERINFOURL = process.env.TokenIssuerUrl;
    const EXPECTEDKEYS = ["email", "name"]
    const headers = {"Authorization": token, "Content-Type": "application/json"}
    const userInfoResponse =  await fetch(USERINFOURL, {headers});
    if(userInfoResponse.status !== 200) {
        console.error(`Could not fetch userinfo from provider, status ${userInfoResponse.status}`);
        return null;
    }
    const userInfo = await userInfoResponse.json();
    if(!EXPECTEDKEYS.every(key => Object.keys(userInfo).includes(key))) {
        console.error(`Details was missing from userinfo, userinfo: ${JSON.stringify(userInfo)}`);
        return null
    }
    return { email: userInfo["email"], name: userInfo["name"] } as User
}

async function getCosmosClient() {
    const endpoint = process.env.CosmosUrl;
    const key = process.env.CosmosKey;
    return new CosmosClient({endpoint, key})
}

function getUserContainer(client: CosmosClient) {
    const db = client.database(DBNAME)
    return db.container(CONTAINERNAME)
}

async function userIsInvited(client: CosmosClient, user: User) {
    const foundUser = getUserContainer(client).item(user.email.toLowerCase());
    return !!foundUser
}

async function getAllInvitedUsers(client: CosmosClient) {
    const q: SqlQuerySpec = {
        query: `SELECT * FROM ${CONTAINERNAME} c where c.type = @t`,
        parameters: [
            {name: "@t", value: itemTypes.InvitedUser}
        ]
    }
    const {resources} = await getUserContainer(client).items.query(q).fetchAll();
    return resources;
}
export async function testauth(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const cosmosClient = await getCosmosClient();
    const accessToken = request.headers.get(TOKENHEADERNAME)
    if(!accessToken) return { status: 401, body: "Access token is missing."}

    const user = await getUserInfoFromIssuer(accessToken);
    if(!user) {
        return { status: 500, body: 'Failed to fetch userinfo' }
    }

    const isInvited = await userIsInvited(cosmosClient, user);
    if(!isInvited) {
        console.warn(`User ${user.email} (${user.name}) is not invited`);
        return {status: 401, body:"You are not invited."}
    }

    return { body: `Hello, ${user.name}, you are invited.` };
};

app.http('testauth', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: testauth,
    extraOutputs: []
});