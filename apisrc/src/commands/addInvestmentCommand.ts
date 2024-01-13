import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";
import { Investment } from "../types/investments.js";
import { cache } from "../services/cache.js"

export async function addInvestmentCommand(investment: Investment) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...investment, "_type": itemTypes.Investment})
    if(statusCode > 399) return false;
    cache.del(`${itemTypes.Investment}-${investment.leagueId}`)
    cache.del("error");
    return true;
}