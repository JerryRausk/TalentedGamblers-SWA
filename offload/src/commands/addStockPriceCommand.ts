import { getContainer } from "../services/cosmosService.js";
import { itemTypes, StockPrice } from "../types/dbTypes.js";

export async function addStockPriceCommand(stockPrice: StockPrice) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...stockPrice, "_type": itemTypes.StockPrice})
    if(statusCode > 399) return false;
    return true;
}