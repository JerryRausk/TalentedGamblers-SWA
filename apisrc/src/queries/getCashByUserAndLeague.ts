import { Investment, InvestmentTypes } from "../types/investments.js";
import { getInvestmentsByUserAndLeague } from "./getInvestmentsByUserAndLeague.js";
export async function getCashByUserAndLeague(userId: string, leagueId: string) {
    
    const investments = await getInvestmentsByUserAndLeague(userId, leagueId)
    let cash = 1000.00;
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