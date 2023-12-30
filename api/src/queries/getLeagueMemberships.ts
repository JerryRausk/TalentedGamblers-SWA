import { itemTypes } from "../itemTypes";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { LeagueMembership } from "../itemTypes";

export async function getLeagueMemberships(userId: string) {
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
    return memberships;
}