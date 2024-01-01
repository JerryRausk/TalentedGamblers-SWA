import { Investment, InvestmentTypes, StockHolding, StockInvestment } from "../types/investments";

export async function calculateStockHoldingsForUser(userInvestments: Investment[]) {
    const stockInvestments = userInvestments.filter(i => i.data.type === InvestmentTypes.Stock);
    let stockHoldings = {} as Record<string, StockHolding>
    for(const s of stockInvestments) {
        const stock = s.data as StockInvestment;
        if(Object.keys(stockHoldings).includes(stock.ticker)) {
            if(stock.buyPosition) {
                stockHoldings[stock.ticker].heldAmount += stock.amount;
            } else {
                stockHoldings[stock.ticker].heldAmount -= stock.amount;
            }
        } else {
            stockHoldings[stock.ticker] = {ticker: stock.ticker, heldAmount: stock.amount}
        }
    }

    const stockHoldingList = Object.entries(stockHoldings).map(holding => holding[1]).filter(h => h.heldAmount != 0)
    return stockHoldingList
}