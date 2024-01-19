import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";

export async function addInvalidStockTickerCommand(ticker: string) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({ticker, "_type": itemTypes.InvalidStockTicker})
    if(statusCode > 399) return false;
    return true;
}