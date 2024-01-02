import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";

export async function addInvestmentCommand(investment: any) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...investment, "_type": itemTypes.Investment})
    if(statusCode > 399) return false;
    return true;
}