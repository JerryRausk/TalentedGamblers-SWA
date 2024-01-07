import { calculateCashHoldingsForUser, calculateBetHoldingForUser, calculateOtherInvestmentHoldingsForUser, calculateStockHoldingsForUser } from "../services/calculator";
import { getLeagueInvestmentsQuery } from "../queries/getLeagueInvestmentsQuery";
import { Holdings, LeagueInvestmentsDTO } from "../types/investments";
import { getLeagueMembersQuery } from "../queries/getLeagueMembersQuery"

export async function getLeagueInvestmentsProcess(leagueId: string): Promise<LeagueInvestmentsDTO> {
    const investments = await getLeagueInvestmentsQuery(leagueId);
    const leagueMembers = await getLeagueMembersQuery(leagueId);
    const holdings = [] as Holdings[];
    for(const member of leagueMembers) {
        const currUserInvestments = investments.filter(i => i.userId === member.userId)
        holdings.push(
            {
                userId: member.userId,
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