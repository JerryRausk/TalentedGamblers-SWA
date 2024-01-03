export enum InvestmentTypes {
    Stock = "stock",
    Bet = "bet",
    Other = "other"
}
export type StockInvestment = {
    type: InvestmentTypes.Stock,
    buyPosition: boolean,
    ticker: string,
    price: number,
    amount: number,
}
export type BetInvestment = {
    type: InvestmentTypes.Bet,
    uniqueId: string,
    amount: number,
    odds: number,
    expiryDate: string,
    result: "win" | "loss" | "not settled"
}
export type Investment = {
  id: string,
  userId: string,
  leagueId: string,
  date: string,
  verified: boolean,
  verifiedBy: string | null
  data: StockInvestment | BetInvestment
}

export type AddInvestmentDTO = {
    addedInvestment: Investment,
    holdingsAfterInvestment: Holdings
}

export type StockHolding = {
        ticker: string,
        heldAmount: number,
}

export type Holdings = {
    userId: string,
    leagueId: string,
    stockHoldings: StockHolding[],
    cashHoldings: number
}

export type LeagueInvestmentsDTO = {
    investments: Investment[],
    holdings: Holdings[]
}
