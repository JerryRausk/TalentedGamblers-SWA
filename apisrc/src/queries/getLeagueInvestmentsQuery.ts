import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { Investment } from "../types/investments.js";
import { cache } from "../services/cache.js"

export function getLeagueInvestmentsCacheKey(leagueId: string) {
    return `${itemTypes.Investment}-${leagueId}`
  }
export async function getLeagueInvestmentsQuery(leagueId: string) {
    const leagueInvestmentKey = getLeagueInvestmentsCacheKey(leagueId);
    const cachedInvestments = cache.get<Investment[]>(leagueInvestmentKey)
    if(cachedInvestments) {
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
    cache.set(leagueInvestmentKey, investments);
    return investments;
}