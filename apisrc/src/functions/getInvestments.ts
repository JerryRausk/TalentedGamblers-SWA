import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getInvestmentsByUserAndLeagueQuery } from "../queries/getInvestmentsByUserAndLeagueQuery.js";
async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
  const body: any = await request.json();
  const leagueId = body.leagueId;
  if (!leagueMemberships.map(l => l.leagueId).includes(leagueId)) return { status: 401, jsonBody: {} }

  const res = await getInvestmentsByUserAndLeagueQuery(user.email, leagueId)

  return { status: 200, jsonBody: res };
}

export async function getInvestments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return addMiddleWares(request, context, callHandler)
};

app.http('getInvestments', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: getInvestments
});
