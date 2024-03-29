import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership } from "../types/league.js";
import { randomUUID } from "crypto";
import { addInvestmentCommand  } from "../commands/addInvestmentCommand.js";
import { AddInvestmentDTO, Investment, Holdings, InvestmentTypes } from "../types/investments.js";
import { getLeagueInvestmentsProcess } from "../processes/getLeagueInvestmentsProcess.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const inv = await request.json() as Investment
    if(inv.data.type === InvestmentTypes.Bet) {
        inv.data.betId = randomUUID()
    }
    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if(!leagueMembershipIds.includes(inv.leagueId)) {
        console.error(`User ${user.email} tried to add investment to league ${inv.leagueId} without membership.`)
        return {status: 401, jsonBody: {success: false}}
    }

    if(user.email !== inv.userId) {
        console.error(`User ${user.email} tried to add investment for user ${inv.userId}`)
        return {status: 401, jsonBody: {success: false}}
    }
    
    const invWithId = {...inv, id: randomUUID()}

    // TODO: impl backend validation when buying / selling stocks.
    const addInvSuccess = await addInvestmentCommand(invWithId)
    if(!addInvSuccess) return { status: 500, jsonBody: {}}
   
    const leagueInvestments = await getLeagueInvestmentsProcess(inv.leagueId)
    
    const jsonResponse = {
        addedInvestment: invWithId, 
        leagueInvestments: leagueInvestments
    } satisfies AddInvestmentDTO

    return { status: 201, jsonBody: jsonResponse }
}

export async function addInvestment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('addInvestment', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addInvestment
});
