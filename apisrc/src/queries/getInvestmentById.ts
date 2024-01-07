import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { itemTypes } from "../types/dbTypes";
import { Investment,  } from "../types/investments.js";
export async function getInvestmentById(invId: string): Promise<Investment | null> {
    const container = await getContainer();
    return container.item(invId, itemTypes.Investment).read()
        .then(i => {
            return i ? stripMetaFromResource<Investment>(i.resource) : null;
        })
        .catch(e => {
            console.error(`Could not fetch item with id ${invId}, e: ${JSON.stringify(e)}`)
            return null
        })
}