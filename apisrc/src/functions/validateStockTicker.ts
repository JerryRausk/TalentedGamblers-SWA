import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership } from "../types/league.js";
async function callHandler(req: HttpRequest, __: InvocationContext, ___: User, _: LeagueMembership[]): Promise<HttpResponseInit> {
    const tickerToValidate: string | undefined = (await req.json())["ticker"];
    if(!tickerToValidate) return { status: 400, jsonBody: false};

    const TwoMinutesAgo = Math.round(new Date().getTime() / 1000) - 120
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${tickerToValidate}?period1=${TwoMinutesAgo}&period2=${TwoMinutesAgo}&useYfid=true&interval=1d`);
    if(res.status !== 200) return { status: 200, jsonBody: false}
    return { status: 200, jsonBody: true };
}

export async function validateStockTicker(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('validateStockTicker', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: validateStockTicker
});

