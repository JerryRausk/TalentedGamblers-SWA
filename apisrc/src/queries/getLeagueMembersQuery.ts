import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { LeagueMembership } from "../types/league.js";

export async function getLeagueMembersQuery(leagueId: string) {
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: "SELECT * FROM c WHERE c.leagueId = @leagueId", 
                parameters: [{name: "@leagueId", value: leagueId}]
            }, 
            {partitionKey: [itemTypes.LeagueMembership]}
        )
        .fetchAll();
    const members = res.resources.map(r => stripMetaFromResource<LeagueMembership>(r))

    return members;
}