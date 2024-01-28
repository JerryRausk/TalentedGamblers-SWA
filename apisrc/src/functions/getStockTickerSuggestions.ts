import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership } from "../types/league.js";
import { YahooSearchResult } from "../types/yahooTypes.js"
import { TickerSuggestion } from "../types/dbTypes.js";

async function callHandler(request: HttpRequest, _: InvocationContext, __: User, ___: LeagueMembership[]): Promise<HttpResponseInit> {
    const {ticker} = await request.json() as {ticker: string}
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker.replace(" ", "-")}&quotesCount=5&newsCount=0&listsCount=0&enableFuzzyQuery=true&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&enableCb=false&enableNavLinks=false&enableEnhancedTrivialQuery=false&enableResearchReports=false&enableCulturalAssets=false&enableLogoUrl=false&researchReportsCount=0`
    
    const res = await fetch(yahooUrl);
    const resJson = await res.json() as YahooSearchResult;
    const suggestions = resJson.quotes.map(q => ({ticker: q.symbol, longName: q.longname, shortName: q.shortname, market: q.exchange} satisfies TickerSuggestion)) 
    return { status: 200, jsonBody: suggestions  }
}

export async function getStockTickerSuggestions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getStockTickerSuggestions', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: getStockTickerSuggestions
});




