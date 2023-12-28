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
    amount: number,
    odds: number,
    expiryDate: string,
}
export type Investment = {
  id: string,
  date: string,
  verified: boolean,
  verifiedBy: string | null
  data: StockInvestment | BetInvestment
}