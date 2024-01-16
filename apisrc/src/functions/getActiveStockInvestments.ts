import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getLeagueInvestmentsProcess } from "../processes/getLeagueInvestmentsProcess.js";

export async function getLeagueInvestments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const jsonReqBody = await request.json()
    const leagueId = jsonReqBody["leagueId"]

    const leagueInvestments = await getLeagueInvestmentsProcess(leagueId);

    const activeStockInvestments = leagueInvestments.holdings.flatMap(h => h.stockHoldings.map(sh => sh.ticker))
    return { status: 200, jsonBody: activeStockInvestments }
};

app.http('getLeagueInvestments', {
    methods: ['POST'],
    authLevel: 'function',
    handler: getLeagueInvestments
});
