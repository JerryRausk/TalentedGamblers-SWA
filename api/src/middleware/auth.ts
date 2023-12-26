import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Container, CosmosClient } from "@azure/cosmos";
const TOKENHEADERNAME = "X-App-Authorization";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;
type User = { email: string, name: string }

async function getUserInfoFromIssuer(token: string) {
    const USERINFOURL = process.env.TokenIssuerUrl;
    const EXPECTEDKEYS = ["email", "name"]
    const headers = { "Authorization": token, "Content-Type": "application/json" }
    const userInfoResponse = await fetch(USERINFOURL, { headers });
    if (userInfoResponse.status !== 200) {
        console.error(`Could not fetch userinfo from provider, status ${userInfoResponse.status}`);
        return null;
    }
    const userInfo = await userInfoResponse.json();
    if (!EXPECTEDKEYS.every(key => Object.keys(userInfo).includes(key))) {
        console.error(`Details was missing from userinfo, userinfo: ${JSON.stringify(userInfo)}`);
        return null
    }
    return { email: userInfo["email"], name: userInfo["name"] } as User
}

async function getCosmosClient() {
    const endpoint = process.env.CosmosUrl;
    const key = process.env.CosmosKey;
    return new CosmosClient({ endpoint, key })
}

function getContainer(client: CosmosClient) {
    const db = client.database(DBNAME)
    return db.container(CONTAINERNAME)
}

async function getItemOrNullById<T>(container: Container, id: string, partitionKey?: string): Promise<T | null> {
    /* 
        If no partitionKey is provided, id will be used as partitionKey. 
        If found in db removes all _ props (metadata from cosmos) and returns it, else returns null. 
    */

    if(!partitionKey) partitionKey = id;
    const i = await container.item(id, partitionKey).read();
    if (i.statusCode === 200) return Object.entries(i.resource).reduce((acc, [key, val]) => {
        if (!key.startsWith("_")) return { ...acc, [key]: val }
        else return acc
    }, {}) as T;
    return null;
}
async function userIsInvited(client: CosmosClient, user: User) {
    const foundUser = await getItemOrNullById<User>(getContainer(client), user.email.toLowerCase());
    if (foundUser) return true;
    return false;
}

export async function Authenticate(request: HttpRequest) {
    const cosmosClient = await getCosmosClient();
    const accessToken = request.headers.get(TOKENHEADERNAME)
    if (!accessToken) return {
        success: false as const,
        data: { status: 401, body: "Access token is missing." } as HttpResponseInit
    }

    const user = await getUserInfoFromIssuer(accessToken);
    const isInvited = await userIsInvited(cosmosClient, user);
    if (!isInvited) return {
        success: false as const,
        data: { status: 403, body: "Not invited" } as HttpResponseInit
    }

    return { success: true as const, data: user };
}