import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";
import { Investment } from "../types/investments.js";

export async function updateInvestmentByIdCommand(investment: Investment) {
    const container = await getContainer();
    const {statusCode, resource} = await container.item(investment.id, itemTypes.Investment).replace({...investment, "_type": itemTypes.Investment});
    if(statusCode > 399) {
        console.error(`Error replace investment with id ${investment.id}, error ${statusCode}`)
        return null;
    }

    return resource
}