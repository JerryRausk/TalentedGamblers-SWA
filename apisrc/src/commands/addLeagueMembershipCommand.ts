import { getContainer } from "../services/cosmosService.js";
import { itemTypes } from "../types/dbTypes.js";
import { LeagueMembership } from "../types/league.js";
import { cache } from "../services/cache.js"

export async function addLeagueMembershipCommand(leagueMembership: LeagueMembership) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...leagueMembership, "_type": itemTypes.LeagueMembership})
    if(statusCode > 399) return false;

    cache.del(`${itemTypes.LeagueMembership}-${leagueMembership.userId}`)
    cache.del(`${itemTypes.LeagueMembership}-${leagueMembership.leagueId}`)
    return true;
}