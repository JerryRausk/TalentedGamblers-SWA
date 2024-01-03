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

export type BetInvestment = {
    type: InvestmentTypes.Bet,
    uniqueId: string,
    amount: number,
    odds: number,
    expiryDate: string,
    result: BetResults
}

export type NotSettledBetInvestMent = Omit<BetInvestment, "result"> & { result: BetResults.NotSettled}

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
    leagueInvestments: LeagueInvestmentsDTO
}

export type StockHolding = {
        ticker: string,
        heldAmount: number,
}

export type Holdings = {
    userId: string,
    leagueId: string,
    stockHoldings: StockHolding[],
    cashHoldings: number,
    notSettledBets: NotSettledBetInvestMent[]
}

export type LeagueInvestmentsDTO = {
    investments: Investment[],
    holdings: Holdings[]
}
