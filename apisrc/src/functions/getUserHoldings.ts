import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getInvestmentsByUserAndLeagueQuery } from "../queries/getInvestmentsByUserAndLeagueQuery.js";
import { calculateCashHoldingsForUser, calculateNotSettledBetsForUser, calculateOtherInvestmentHoldingsForUser, calculateStockHoldingsForUser } from "../services/calculator.js";
import { Holdings } from "../types/investments.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const jsonReqBody = await request.json()
    const leagueId = jsonReqBody["leagueId"]

    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if(!leagueMembershipIds.includes(leagueId)) {
        console.error(`User ${user.email} tried to fetch holdings for league ${leagueId} without membership.`)
        return {status: 401, jsonBody: {success: false}}
    }

    const investments = await getInvestmentsByUserAndLeagueQuery(user.email, leagueId)
    const holdings = {
        userId: user.email,
        leagueId: leagueId,
        stockHoldings: await calculateStockHoldingsForUser(investments),
        cashHoldings: await calculateCashHoldingsForUser(investments),
        notSettledBets: await calculateNotSettledBetsForUser(investments),
        otherInvestmentsHoldings: await calculateOtherInvestmentHoldingsForUser(investments)
    } satisfies Holdings;

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
