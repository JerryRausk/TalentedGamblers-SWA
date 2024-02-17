import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";
import { InvestmentTypes } from "../types/investments.js";
import { ErrorResponse } from "@azure/cosmos";
import { cache } from "../services/cache.js";
import { getLeagueInvestmentsCacheKey } from "../queries/getLeagueInvestmentsQuery.js";

export async function updateTickerForUserAndLeagueCommand(oldTicker: string, newTicker: string, userId: string, leagueId: string) {
    const container = await getContainer();
    const res = await container.items.query(
        {
            query: `SELECT * 
                    FROM c 
                    WHERE c.leagueId = @leagueId 
                    AND c.data.type = @stock 
                    AND c.data.ticker = @oldTicker
                    AND c.userId = @userId`, 
            parameters: [
                {name: "@leagueId", value: leagueId}, 
                {name: "@stock", value: InvestmentTypes.Stock}, 
                {name: "@oldTicker", value: oldTicker},
                {name: "@userId", value: userId}
            ]
        }, 
        {partitionKey: [itemTypes.Investment]}
    )
    .fetchAll();

    res.resources.map(async r => {
        const replica = structuredClone(r);
        replica.data.ticker = newTicker
        try {
            const upsertRes = await container.items.upsert(replica);
            if(upsertRes.statusCode > 399) {
                console.error("Something went wrong when updating ", oldTicker, " to ", newTicker);
            } 
        } catch(err) {
            if(err instanceof ErrorResponse) {
                console.error("Upsert failed with code ", err.code, " and message ", err.body.message)
            }
        }
        
    })
    cache.del(getLeagueInvestmentsCacheKey(leagueId));
    return true;
}