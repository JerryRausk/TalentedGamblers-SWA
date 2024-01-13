import { BetInvestment, Investment, InvestmentTypes, OtherInvestment, OtherInvestmentHolding, StockHolding, StockInvestment } from "../types/investments";

export async function calculateStockHoldingsForUser(userInvestments: Investment[]) {

  const stockInvestments = userInvestments.filter(i => i.data.type === InvestmentTypes.Stock);
  if (stockInvestments.length === 0) return []

  let stockHoldings = {} as Record<string, StockHolding>
  for (const s of stockInvestments) {
    const stock = s.data as StockInvestment;
    if (Object.keys(stockHoldings).includes(stock.ticker)) {
      if (stock.buyPosition) {
        stockHoldings[stock.ticker].averageBuyPrice = ((stockHoldings[stock.ticker].heldAmount * stockHoldings[stock.ticker].averageBuyPrice) + stock.price )
            / (stock.amount + stockHoldings[stock.ticker].heldAmount)
    
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
        heldAmount: stock.buyPosition 
          ? stock.amount 
          : -1 * stock.amount,
        averageBuyPrice: stock.price / stock.amount
      }
    }
  }
  const stockHoldingList = Object.entries(stockHoldings).map(holding => holding[1]).filter(h => h.heldAmount != 0)
  return stockHoldingList
}

export async function calculateBetHoldingForUser(investments: Investment[]) {
  /* Returns all investment of type bet that has not yet been closed */
  const betInvestments = investments.filter(i => i.data.type === InvestmentTypes.Bet);
  if (betInvestments.length === 0) return [];

  const closedBetsIds = betInvestments.filter(b => b.data.type === InvestmentTypes.Bet && b.data.open === false).map(b => (b.data as BetInvestment).betId);
  const openBets = betInvestments.filter(b => b.data.type === InvestmentTypes.Bet && b.data.open === true);

  const betHoldings = [] as Investment[]
  for(const b of openBets) {
    if(!closedBetsIds.includes((b.data as BetInvestment).betId)) betHoldings.push(b)
  }

  return betHoldings;
}

export async function calculateCashHoldingsForUser(investments: Investment[]) {
  let cash = 1000.00;
  if (investments.length === 0) return cash;
  for (const r of investments) {
    if (r.data.type === InvestmentTypes.Stock) {
      r.data.buyPosition 
        ? cash -= (r.data.price) 
        : cash += (r.data.price)
    }
    else if (r.data.type === InvestmentTypes.Bet) {
      r.data.open === true
        ? cash -= r.data.amount
        : cash += r.data.amount;
    }
    else if (r.data.type === InvestmentTypes.Other) {
      r.data.buyPosition 
        ? cash -= r.data.price 
        : cash += r.data.price;
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
        console.warn(`Duplicate name of other investment ${inv.name}, ignoring duplicate.`)
      } else {
        delete otherHoldings[inv.name]
      }
    } else {
      otherHoldings[inv.name] = { name: inv.name, buyPrice: inv.price }
    }
  }
  const otherHoldingsList = Object.entries(otherHoldings).map(holding => holding[1]);
  return otherHoldingsList
}

export async function calculateTotalHoldingValue(investments: Investment[]) {
  const stocks = (await calculateStockHoldingsForUser(investments)).reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0);
  const other = (await calculateOtherInvestmentHoldingsForUser(investments)).reduce((acc, curr) => acc += curr.buyPrice, 0);
  const bets = (await calculateBetHoldingForUser(investments)).reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0);
  const cash = await calculateCashHoldingsForUser(investments);

  return stocks + other + bets + cash
}