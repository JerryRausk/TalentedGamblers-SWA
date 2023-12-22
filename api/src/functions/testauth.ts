import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";
import { itemTypes } from "../itemTypes";
const TOKENHEADERNAME = "Authorization";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;
type User = {email: string, name: string}


async function getUserInfoFromIssuer(token: string) {
    const USERINFOURL = process.env.TokenIssuerUrl;
    const EXPECTEDKEYS = ["email", "name"]
    const headers = {[TOKENHEADERNAME]: token, "Content-Type": "application/json"}
    const userInfo =  await fetch(USERINFOURL, {headers});
    const userInfoObj = await userInfo.json();
    if(!EXPECTEDKEYS.every(key => Object.keys(userInfoObj).includes(key))) return null;
    return { email: userInfoObj["email"], name: userInfoObj["name"] } as User
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
    const isInvited = await userIsInvited(cosmosClient, user);
    await getAllInvitedUsers(cosmosClient);
    return { body: `Hello, ${user.name}, your invitation returned ${isInvited}` };
};

app.http('testauth', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: testauth,
    extraOutputs: []
});