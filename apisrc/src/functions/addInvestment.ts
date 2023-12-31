import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { randomUUID } from "crypto";
import { addInvestmentCommand  } from "../commands/addInvestmentCommand.js";
async function callHandler(request: HttpRequest, context: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const inv: any = await request.json()
    const invWithId = {...inv, id: randomUUID()}
    const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
    if(!leagueMembershipIds.includes(inv.leagueId)) {
        console.error(`User ${user.email} tried to add investment to league ${inv.leagueId} without membership.`)
        return {status: 401, jsonBody: {success: false}}
    }
    console.log(`Adding investment: ${JSON.stringify(invWithId)}`)
    const addInvSuccess = addInvestmentCommand(invWithId)
    if(!addInvSuccess) return { status: 500, jsonBody: {}}
    return { status: 201, jsonBody: {investment: invWithId} }
}

export async function addInvestment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('addInvestment', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addInvestment
});
