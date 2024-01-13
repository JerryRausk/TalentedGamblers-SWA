import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getItemOrNullById } from "../services/cosmosService.js"
import { itemTypes } from "../types/dbTypes.js";
import {cache} from "../services/cache.js"

const TOKENHEADERNAME = "X-App-Authorization";
type User = { email: string, name: string }

async function getUserInfoFromIssuer(token: string) {
    const cachedUser = cache.get<User>(token);
    if(cachedUser) {
        return cachedUser
    }
    const USERINFOURL = process.env.TokenIssuerUrl;
    const EXPECTEDKEYS = ["email", "name"]
    const headers = { "Authorization": token, "Content-Type": "application/json" }
    const userInfoResponse = await fetch(USERINFOURL, { headers });
    if (userInfoResponse.status !== 200) {
        return null;
    }
    const userInfo = await userInfoResponse.json();
    if (!EXPECTEDKEYS.every(key => Object.keys(userInfo).includes(key))) {
        return null
    }
    const user = { email: userInfo["email"], name: userInfo["name"] } as User
    cache.set(token, user)
    return user
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