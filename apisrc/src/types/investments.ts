export enum InvestmentTypes {
    Stock = "stock",
    Bet = "bet",
    Other = "other"
}

export enum BetResults {
    Win = "win",
    Loss = "loss",
    NotSettled = "not settled"
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

export type BetInvestment = {
    type: InvestmentTypes.Bet,
    name: string,
    amount: number,
    odds: number | null,
    expiryDate: string,
    result: BetResults,
    winAmount: number | null,
}

export type NotSettledBetInvestMent = Omit<BetInvestment, "result"> & { result: BetResults.NotSettled}

export type Investment = {
  id: string,
  userId: string,
  leagueId: string,
  date: string,
  verified: boolean,
  verifiedBy: string | null
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
    notSettledBets: NotSettledBetInvestMent[],
    otherInvestmentsHoldings: OtherInvestmentHolding[],
}

export type LeagueInvestmentsDTO = {
    investments: Investment[],
    holdings: Holdings[]
}

export type SettleBetDTO = {
    betId: string,
    winAmount: number
}
