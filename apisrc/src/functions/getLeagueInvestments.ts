import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getLeagueInvestmentsQuery } from "../queries/getLeagueInvestmentsQuery.js";
import { calculateStockHoldingsForUser, calculateCashHoldingsForUser } from "../services/calculator.js";
import { LeagueInvestmentsDTO } from "../types/investments.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const jsonReqBody = await request.json()
    const leagueId = jsonReqBody["leagueId"]
    const latestN = jsonReqBody["latestN"]

    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if (!leagueMembershipIds.includes(leagueId)) {
        console.error(`User ${user.email} tried to fetch investments for league ${leagueId} without membership.`)
        return { status: 401, jsonBody: { success: false } }
    }

    const investments = await getLeagueInvestmentsQuery(leagueId, latestN ? Number(latestN) : 0);

    const uniqueUsers = new Set(investments.map(i => i.userId))
    const holdings = [];
    for(const userId of uniqueUsers) {
        const currUserInvestments = investments.filter(i => i.userId === userId)
        holdings.push(
            {
                userId,
                leagueId,
                stockHoldings: await calculateStockHoldingsForUser(currUserInvestments),
                cashHoldings: await calculateCashHoldingsForUser(currUserInvestments)
            }
        )
    }
    
    const retBody = {
        investments,
        holdings
    } satisfies LeagueInvestmentsDTO

    return { status: 201, jsonBody: retBody }
}

export async function getLeagueInvestments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getLeagueInvestments', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getLeagueInvestments
});
