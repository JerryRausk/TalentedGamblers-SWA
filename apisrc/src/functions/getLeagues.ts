import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getLeaguesByIds } from "../queries/getLeaguesByIds.js";
async function callHandler(_: HttpRequest, __: InvocationContext, ___: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const res = await getLeaguesByIds(leagueMemberships.map(l => l.leagueId))
    return { jsonBody: res };
}

export async function getLeagues(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getLeagues', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getLeagues
});
