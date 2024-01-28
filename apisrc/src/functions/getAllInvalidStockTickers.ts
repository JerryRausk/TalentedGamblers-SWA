import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership } from "../types/league.js";
import { getAllInvalidStockTickersQuery } from "../queries/getAllInvalidStockTickersQuery.js";

async function callHandler(request: HttpRequest, _: InvocationContext, user: User, leagueMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const invalidTickers = await getAllInvalidStockTickersQuery();

    return { status: 200, jsonBody: invalidTickers.map(i => i.id) }
}

export async function getAllInvalidStockTickers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getAllInvalidStockTickers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getAllInvalidStockTickers
});
