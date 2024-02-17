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

export type OtherInvestment = {
    type: InvestmentTypes.Other,
    name: string,
    price: number,
    buyPosition: boolean
}

export type Investment = {
  id: string,
  userId: string,
  leagueId: string,
  date: string,
  data: StockInvestment | BetInvestment | OtherInvestment
}

export type AddInvestmentDTO = {
    addedInvestment: Investment,
    leagueInvestments: LeagueInvestmentsDTO
}

export type StockHolding = {
        ticker: string,
        heldAmount: number,
        averageBuyPrice: number,
}

export type OtherInvestmentHolding = {
    name: string,
    buyPrice: number
}
export type Holdings = {
    userId: string,
    leagueId: string,
    stockHoldings: StockHolding[],
    cashHoldings: number,
    betHoldings: Investment[],
    otherInvestmentsHoldings: OtherInvestmentHolding[],
}

export type LeagueInvestmentsDTO = {
    investments: Investment[],
    holdings: Holdings[]
}

export type BetInvestment = {
    type: InvestmentTypes.Bet,
    name: string,
    amount: number,
    odds: number | null,
    expiryDate: string,
    betId: string,
    open: boolean /* When bet is placed it is open, when bet is closed a trade with same  */
}

export type SettleBetDTO = {
    investmentId: string,
    winAmount: number
}

export enum BetResults {
    Win = "win",
    Loss = "loss"
}

export const MarketSuffix = {
    Stockholm: ".ST",
    Oslo: ".OL",
    Helsinki: ".HE",
    Copenhagen: ".CO",
    US: " "
}