import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { LeagueMembership } from "../types/league.js";
import { cache } from "../services/cache.js";

export async function getLeagueMemberships(userId: string) {
    const chachedMemberships = cache.get<LeagueMembership[]>(`${itemTypes.LeagueMembership}-${userId}`)
    if (chachedMemberships) {
        return chachedMemberships
    }
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: "SELECT * FROM c WHERE c.userId = @userId", 
                parameters: [{name: "@userId", value: userId}]
            }, 
            {partitionKey: [itemTypes.LeagueMembership]}
        )
        .fetchAll();
    const memberships = [] as LeagueMembership[];
    for(const r of res.resources) {
        memberships.push(
            stripMetaFromResource<LeagueMembership>(r)
        )
    }
    cache.set(`${itemTypes.LeagueMembership}-${userId}`, memberships);
    return memberships;
}