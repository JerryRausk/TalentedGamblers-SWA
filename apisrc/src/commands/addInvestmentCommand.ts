import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";
import { Investment } from "../types/investments.js";
import { cache } from "../services/cache.js"
import { getLeagueInvestmentsCacheKey } from "../queries/getLeagueInvestmentsQuery.js";
export async function addInvestmentCommand(investment: Investment) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...investment, "_type": itemTypes.Investment})
    if(statusCode > 399) return false;
    cache.del(getLeagueInvestmentsCacheKey(investment.leagueId))
    return true;
}