import { itemTypes, InvalidStockTicker } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { cache } from "../services/cache.js"

export async function getAllInvalidStockTickersQuery() {
    const invalidStockTickersCacheKey = `InvalidStockTickers`
    const cachedInvalidStockTickers = cache.get<InvalidStockTicker[]>(invalidStockTickersCacheKey)
    if(cachedInvalidStockTickers) {
        return cachedInvalidStockTickers;
    }
    const container = await getContainer();
    const res = await container.items.readAll({partitionKey: itemTypes.InvalidStockTicker}).fetchAll();
    const invalidTickers = res.resources.map(r => stripMetaFromResource<InvalidStockTicker>(r));
    cache.set(invalidStockTickersCacheKey, invalidTickers, 600);
    return invalidTickers;
}