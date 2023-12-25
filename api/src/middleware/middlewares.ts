import {Authenticate} from "./auth.js";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
type User = {email: string, name: string}
type PermissionLevel = "user" | "admin";
export type Permission = {subject: string, level: PermissionLevel, user: User}


export async function addMiddleWares(request: HttpRequest, context: InvocationContext, cb: CallableFunction): Promise<HttpResponseInit>  {
    const authenticated = await Authenticate(request);
    if(authenticated.success === false) {
        return authenticated.data
    }
    const permissions: Permission[] = [];
    return cb(request, context, authenticated.data, permissions)
}