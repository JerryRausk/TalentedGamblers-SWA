import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getUserDetailsQuery } from "../queries/getUserDetailsQuery.js";

async function callHandler(_: HttpRequest, __: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const queryRes = await getUserDetailsQuery(user.email)
    return { status: 200, jsonBody: queryRes }
}

export async function getUserDetails(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getUserDetails', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getUserDetails
});
