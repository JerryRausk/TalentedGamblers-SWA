import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const TOKENHEADERNAME = "Authorization";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;
type User = {email: string, name: string}
type AuthenticatedRequest = (request: HttpRequest, context: InvocationContext, user: User) => Promise<HttpResponseInit>


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

function getContainer(client: CosmosClient) {
    const db = client.database(DBNAME)
    return db.container(CONTAINERNAME)
}

async function userIsInvited(client: CosmosClient, user: User) {
    const foundUser = getContainer(client).item(user.email.toLowerCase());
    return !!foundUser
}

export async function Authenticate(request: HttpRequest, context: InvocationContext, req: AuthenticatedRequest): Promise<HttpResponseInit> {
    const cosmosClient = await getCosmosClient();
    const accessToken = request.headers.get(TOKENHEADERNAME)
    if(!accessToken) return { status: 401, body: "Access token is missing."}

    const user = await getUserInfoFromIssuer(accessToken);
    const isInvited = await userIsInvited(cosmosClient, user);
    if(!isInvited) return {status: 403, body: "Not invited"}

    return await req(request, context, user);
}