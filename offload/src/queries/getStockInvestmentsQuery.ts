import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { Investment, InvestmentTypes } from "../types/investments.js";

export async function getStockInvestmentsQuery() {
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: "SELECT * FROM c WHERE c.data.type=@invType", 
                parameters: [{name: "@invType", value: InvestmentTypes.Stock}]
            }, 
            {partitionKey: [itemTypes.Investment]}
        )
        .fetchAll();
    const investments = res.resources.map(r => stripMetaFromResource<Investment>(r));
    return investments;
}