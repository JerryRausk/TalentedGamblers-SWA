
import { calculateStockHoldingsForUser } from "../services/calculator.js";
import { Holdings } from "../types/investments.js";
import { getInvestmentsByUserAndLeague } from "./getInvestmentsByUserAndLeague.js";
import { getCashByUserAndLeague } from "../queries/getCashByUserAndLeague.js";

export async function getHoldingsByUserAndLeague(userId: string, leagueId: string): Promise<Holdings> {
    const investments = await getInvestmentsByUserAndLeague(userId, leagueId)
    
    return {
        userId: userId,
        leagueId: leagueId,
        stockHoldings: await calculateStockHoldingsForUser(investments),
        cashHoldings: await getCashByUserAndLeague(userId, leagueId)
    };
}