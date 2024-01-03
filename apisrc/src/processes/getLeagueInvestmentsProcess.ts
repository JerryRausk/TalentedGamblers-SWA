import { calculateCashHoldingsForUser, calculateNotSettledBetsForUser, calculateStockHoldingsForUser } from "../services/calculator";
import { getLeagueInvestmentsQuery } from "../queries/getLeagueInvestmentsQuery";
import { Holdings, LeagueInvestmentsDTO } from "../types/investments";


export async function getLeagueInvestmentsProcess(leagueId: string): Promise<LeagueInvestmentsDTO> {
    const investments = await getLeagueInvestmentsQuery(leagueId, 0);

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
                notSettledBets: await calculateNotSettledBetsForUser(currUserInvestments)
            }
        )
    }

    return {
        investments,
        holdings
    }
}