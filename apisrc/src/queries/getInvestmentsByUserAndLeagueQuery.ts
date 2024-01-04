import { SqlQuerySpec } from "@azure/cosmos";
import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { Investment } from "../types/investments.js";
export async function getInvestmentsByUserAndLeagueQuery(userId: string, leagueId: string) {
    const q = {
        query: "SELECT * FROM c WHERE c.leagueId = @leagueId and c.userId = @userId ORDER BY c.date ASC", 
        parameters: [{name: "@leagueId", value: leagueId}, {name: "@userId", value: userId}]
    } as SqlQuerySpec
    const container = await getContainer();
    const res = await container.items
        .query(q, {partitionKey: [itemTypes.Investment]})
        .fetchAll();
    const investments = [] as Investment[];
    for(const r of res.resources) {
        investments.push(
            stripMetaFromResource<Investment>(r)
        )
    }
    return investments;
}