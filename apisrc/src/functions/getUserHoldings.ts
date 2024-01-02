import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getHoldingsByUserAndLeagueQuery } from "../queries/getHoldingsByUserAndLeagueQuery.js";
async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const jsonReqBody = await request.json()
    const leagueId = jsonReqBody["leagueId"]

    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if(!leagueMembershipIds.includes(leagueId)) {
        console.error(`User ${user.email} tried to fetch holdings for league ${leagueId} without membership.`)
        return {status: 401, jsonBody: {success: false}}
    }

    const holdings = await getHoldingsByUserAndLeagueQuery(user.email, leagueId);

    return { status: 201, jsonBody: holdings }
}

export async function getUserHoldings(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getUserHoldings', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getUserHoldings
});
