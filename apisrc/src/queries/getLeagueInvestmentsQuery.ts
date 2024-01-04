import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { Investment } from "../types/investments.js";

export async function getLeagueInvestmentsQuery(leagueId: string) {
    const container = await getContainer();
    const res = await container.items
        .query(
            {
                query: `SELECT * FROM c WHERE c.leagueId = @leagueId ORDER BY c.date ASC`, 
                parameters: [{name: "@leagueId", value: leagueId}]
            }, 
            {partitionKey: [itemTypes.Investment]}
        )
        .fetchAll();
    
    return res.resources.map(r => stripMetaFromResource<Investment>(r));
}