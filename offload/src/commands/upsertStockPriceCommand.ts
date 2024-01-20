import { InvocationContext } from "@azure/functions";
import { getContainer } from "../services/cosmosService.js";
import { itemTypes, StockPrice } from "../types/dbTypes.js";
import { ErrorBody, ErrorResponse } from "@azure/cosmos"

export async function upsertStockPriceCommand(stockPrice: StockPrice) {
  // Instead of upserting we can try create and catch fail, about 1/8 of price of upserting.
  // Intentional cheap check if exist, cheaper than querying the item
  const container = await getContainer();
  try {
    const { statusCode, requestCharge } = await container.items.create({ ...stockPrice, "_type": itemTypes.StockPrice })
    console.log("Charge to insert new: ", requestCharge);
  } catch (err) {
    if (err instanceof ErrorResponse && err.code === 409) {
      console.log("Request charge for failed create: ", err.headers["x-ms-request-charge"])
      return true
    }
    console.error("ERROR: ", JSON.stringify(err));
    return false;
  }
  return true;
}