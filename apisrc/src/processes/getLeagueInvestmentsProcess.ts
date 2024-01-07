import { calculateCashHoldingsForUser, calculateBetHoldingForUser, calculateOtherInvestmentHoldingsForUser, calculateStockHoldingsForUser } from "../services/calculator";
import { getLeagueInvestmentsQuery } from "../queries/getLeagueInvestmentsQuery";
import { Holdings, LeagueInvestmentsDTO } from "../types/investments";


export async function getLeagueInvestmentsProcess(leagueId: string): Promise<LeagueInvestmentsDTO> {
    const investments = await getLeagueInvestmentsQuery(leagueId);

    const uniqueUsers = new Set(investments.map(i => i.userId))
    const holdings = [] as Holdings[];
    for(const userId of uniqueUsers) {
        const currUserInvestments = investments.filter(i => i.userId === userId)
        holdings.push(
            {
                userId,
                leagueId,
                stockHoldings: await calculateStockHoldingsForUser(currUserInvestments),
                cashHoldings: await calculateCashHoldingsForUser(currUserInvestments),
                betHoldings: await calculateBetHoldingForUser(currUserInvestments),
                otherInvestmentsHoldings: await calculateOtherInvestmentHoldingsForUser(currUserInvestments)
            }
        )
    }

    return {
        investments,
        holdings
    }
}