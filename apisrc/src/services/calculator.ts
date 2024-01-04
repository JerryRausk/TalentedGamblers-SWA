import { BetResults, Investment, InvestmentTypes, NotSettledBetInvestMent, OtherInvestment, OtherInvestmentHolding, StockHolding, StockInvestment } from "../types/investments";

export async function calculateStockHoldingsForUser(userInvestments: Investment[]) {

  const stockInvestments = userInvestments.filter(i => i.data.type === InvestmentTypes.Stock);
  if (stockInvestments.length === 0) return []

  let stockHoldings = {} as Record<string, StockHolding>
  for (const s of stockInvestments) {
    const stock = s.data as StockInvestment;
    if (Object.keys(stockHoldings).includes(stock.ticker)) {
      if (stock.buyPosition) {
        stockHoldings[stock.ticker].averageBuyPrice = ((stockHoldings[stock.ticker].heldAmount * stockHoldings[stock.ticker].averageBuyPrice) + (stock.amount * stock.price)) / (stock.amount + stockHoldings[stock.ticker].heldAmount)
        stockHoldings[stock.ticker].heldAmount += stock.amount;
      } else {
        if(stockHoldings[stock.ticker].heldAmount === stock.amount) {
          delete stockHoldings[stock.ticker]
        } else {
          stockHoldings[stock.ticker].heldAmount -= stock.amount;
        }
        
      }
    } else {
      stockHoldings[stock.ticker] = {
        ticker: stock.ticker,
        heldAmount: stock.buyPosition ? stock.amount : -1 * stock.amount,
        averageBuyPrice: stock.price
      }
    }
  }
  const stockHoldingList = Object.entries(stockHoldings).map(holding => holding[1]).filter(h => h.heldAmount != 0)
  return stockHoldingList
}

export async function calculateNotSettledBetsForUser(investments: Investment[]) {

  const notSettledBets = [] as NotSettledBetInvestMent[]

  for (const i of investments) {
    if (i.data.type === InvestmentTypes.Bet) {
      if (i.data.result === BetResults.NotSettled) {
        notSettledBets.push(i.data as NotSettledBetInvestMent);
      }
    }
  }
  return notSettledBets;
}

export async function calculateCashHoldingsForUser(investments: Investment[]) {
  let cash = 1000.00;
  if (investments.length === 0) return cash;
  for (const r of investments) {
    if (r.data.type === InvestmentTypes.Stock) {
      r.data.buyPosition ? cash -= (r.data.amount * r.data.price) : cash += (r.data.amount * r.data.price)
    }
    else if (r.data.type === InvestmentTypes.Bet) {
      r.data.result === BetResults.Win ? cash += r.data.amount * r.data.odds : cash -= r.data.amount;
    }
    else if (r.data.type === InvestmentTypes.Other) {
      r.data.buyPosition ? cash -= r.data.amount : cash += r.data.amount;
    }
  }
  return cash;
}

export async function calculateOtherInvestmentHoldingsForUser(investments: Investment[]) {
  const otherInvestments = investments.filter(i => i.data.type === InvestmentTypes.Other);
  if (otherInvestments.length === 0) return []

  let otherHoldings = {} as Record<string, OtherInvestmentHolding>
  for (const s of otherInvestments) {
    const inv = s.data as OtherInvestment;
    if (Object.keys(otherHoldings).includes(inv.name)) {
      if (inv.buyPosition) {
        otherHoldings[inv.name].heldAmount += inv.amount;
      } else {
        otherHoldings[inv.name].heldAmount -= inv.amount;
      }
    } else {
      otherHoldings[inv.name] = { name: inv.name, heldAmount: inv.buyPosition ? inv.amount : -1 * inv.amount }
    }
  }
  const stockHoldingList = Object.entries(otherHoldings).map(holding => holding[1]).filter(h => h.heldAmount != 0)
  return stockHoldingList
}