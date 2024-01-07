import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { BetInvestment, BetResults, SettleBetDTO } from "../types/investments.js";
import { getLeagueInvestmentsProcess } from "../processes/getLeagueInvestmentsProcess.js";
import { getInvestmentById } from "../queries/getInvestmentById.js";
import { addInvestmentCommand } from "../commands/addInvestmentCommand.js";
import { randomUUID } from "crypto";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
  const settledBetDTO = await request.json() as SettleBetDTO;

  const investment = await getInvestmentById(settledBetDTO.investmentId);

  const leagueMembershipIds = leagueMemberships.map(l => l.leagueId)
  if (!leagueMembershipIds.includes(investment.leagueId)) {
    console.error(`User ${user.email} tried to add investment to league ${investment.leagueId} without membership.`)
    return { status: 401, jsonBody: { success: false } }
  }

  if (user.email !== investment.userId) {
    console.error(`User ${user.email} tried to add investment for user ${investment.userId}`)
    return { status: 401, jsonBody: { success: false } }
  }

  const settledBetData = {
    ...investment.data as BetInvestment,
    amount: settledBetDTO.winAmount,
    open: false,
  } satisfies BetInvestment

  const res = await addInvestmentCommand({ ...investment, id: randomUUID(), data: settledBetData });
  if (!res) {
    return { status: 500, jsonBody: { success: false } }
  }
  const leagueHoldings = await getLeagueInvestmentsProcess(investment.leagueId);
  return { status: 200, jsonBody: leagueHoldings }
}

export async function addBetSettled(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return addMiddleWares(request, context, callHandler)
};

app.http('addBetSettled', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: addBetSettled
});
