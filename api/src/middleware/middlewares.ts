import {Authenticate} from "./auth.js";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getLeagueMemberships } from "../queries/getLeagueMemberships.js";
export async function addMiddleWares(request: HttpRequest, context: InvocationContext, cb: CallableFunction): Promise<HttpResponseInit>  {
    const authenticated = await Authenticate(request);
    if(authenticated.success === false) {
        return authenticated.data
    }
    const leagueMemberships = await getLeagueMemberships(authenticated.data.email);
    return cb(request, context, authenticated.data, leagueMemberships)
}