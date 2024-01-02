import { Investment, InvestmentTypes, StockHolding, StockInvestment } from "../types/investments";

export async function calculateStockHoldingsForUser(userInvestments: Investment[]) {
    
    const stockInvestments = userInvestments.filter(i => i.data.type === InvestmentTypes.Stock);
    if(stockInvestments.length === 0) return []

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
            stockHoldings[stock.ticker] = {ticker: stock.ticker, heldAmount: stock.buyPosition ? stock.amount : -1 * stock.amount}
        }
    }

    const stockHoldingList = Object.entries(stockHoldings).map(holding => holding[1]).filter(h => h.heldAmount != 0)
    return stockHoldingList
}

export async function calculateCashHoldingsForUser(investments: Investment[]) {
    let cash = 1000.00;
    if(investments.length === 0) return cash;
    for(const r of investments) {
        if(r.data.type === InvestmentTypes.Stock) {
            r.data.buyPosition ? cash -= (r.data.amount * r.data.price) : cash += (r.data.amount * r.data.price)
        }
        else if(r.data.type === InvestmentTypes.Bet) {
            cash -= r.data.amount
        }
    }
    return cash;
}