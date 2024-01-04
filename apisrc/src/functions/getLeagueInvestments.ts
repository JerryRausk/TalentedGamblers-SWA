import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getLeagueInvestmentsProcess } from "../processes/getLeagueInvestmentsProcess.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const jsonReqBody = await request.json()
    const leagueId = jsonReqBody["leagueId"]

    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if (!leagueMembershipIds.includes(leagueId)) {
        console.error(`User ${user.email} tried to fetch investments for league ${leagueId} without membership.`)
        return { status: 401, jsonBody: { success: false } }
    }

    const leagueInvestments = await getLeagueInvestmentsProcess(leagueId);

    return { status: 201, jsonBody: leagueInvestments }
}

export async function getLeagueInvestments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getLeagueInvestments', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getLeagueInvestments
});
