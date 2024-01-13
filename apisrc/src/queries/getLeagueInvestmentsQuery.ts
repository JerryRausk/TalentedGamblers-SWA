import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { Investment } from "../types/investments.js";
import { cache } from "../services/cache.js"

export async function getLeagueInvestmentsQuery(leagueId: string) {
    const leagueInvestmentKey = `${itemTypes.Investment}-${leagueId}`
    const cachedInvestments = cache.get<Investment[]>(leagueInvestmentKey)
    if(cachedInvestments) {
        console.log("Returning cached investments for league ", leagueId);
        return cachedInvestments;
    }
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: `SELECT * FROM c WHERE c.leagueId = @leagueId ORDER BY c.date ASC`, 
                parameters: [{name: "@leagueId", value: leagueId}]
            }, 
            {partitionKey: [itemTypes.Investment]}
        )
        .fetchAll();
    const investments = res.resources.map(r => stripMetaFromResource<Investment>(r));
    console.log("Setting cached investmenets for league ", leagueId);
    cache.set(leagueInvestmentKey, investments);
    return investments;
}