import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";

export async function getInvalidStockTickersQuery() {
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: "SELECT * FROM c", 
            }, 
            {partitionKey: [itemTypes.InvalidStockTicker]}
        )
        .fetchAll();
    const invalidTickers = res.resources.map(r => stripMetaFromResource<{id: string}>(r));

    return invalidTickers.map(i => i.id);
}