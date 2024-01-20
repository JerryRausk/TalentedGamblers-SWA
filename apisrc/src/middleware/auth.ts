import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { getItemOrNullById } from "../services/cosmosService.js"
import { itemTypes } from "../types/dbTypes.js";
const TOKENHEADERNAME = "X-App-Authorization";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;
export type User = { email: string, name: string }

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

async function userIsInvited(user: User) {
    const foundUser = await getItemOrNullById<User>(user.email.toLowerCase(), itemTypes.InvitedUser);
    if (foundUser) return true;
    return false;
}

export async function Authenticate(request: HttpRequest) {
    const accessToken = request.headers.get(TOKENHEADERNAME)
    if (!accessToken) return {
        success: false as const,
        data: { status: 401, body: "Access token is missing." } as HttpResponseInit
    }

    const user = await getUserInfoFromIssuer(accessToken);
    const isInvited = await userIsInvited(user);
    if (!isInvited) return {
        success: false as const,
        data: { status: 403, body: "Not invited" } as HttpResponseInit
    }

    return { success: true as const, data: user };
}