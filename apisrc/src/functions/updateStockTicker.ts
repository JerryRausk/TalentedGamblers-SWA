import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership } from "../types/league.js";
import { updateTickerForUserAndLeagueCommand } from "../commands/updateTickerForUserAndLeagueCommand.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const updateInfo = await request.json() as {oldTicker: string, newTicker: string, leagueId: string}
    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if(!leagueMembershipIds.includes(updateInfo.leagueId)) {
        console.error(`User ${user.email} tried to update ticker for league ${updateInfo.leagueId} without membership.`)
        return {status: 401, jsonBody: {success: false}}
    }

    const upsertTickerRes = await updateTickerForUserAndLeagueCommand(updateInfo.oldTicker, updateInfo.newTicker, user.email, updateInfo.leagueId)
    if(!upsertTickerRes) return { status: 500, jsonBody: {}}
   
    return { status: 201, jsonBody: {success: true} }
}

export async function updateStockTicker(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('updateStockTicker', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: updateStockTicker
});
