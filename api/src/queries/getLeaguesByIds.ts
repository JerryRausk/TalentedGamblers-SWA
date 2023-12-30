import { SqlQuerySpec } from "@azure/cosmos";
import { itemTypes, League } from "../itemTypes";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
export async function getLeaguesByIds(leagueIds: string[]) {
    const q = {
        query: "SELECT * FROM c WHERE ARRAY_CONTAINS(@leagueIds, c.id)", 
        parameters: [{name: "@leagueIds", value: leagueIds}]
    } as SqlQuerySpec
    const container = await getContainer();
    const res = await container.items
        .query(q, {partitionKey: [itemTypes.League]})
        .fetchAll();
    const leagues = [] as League[];
    for(const r of res.resources) {
        leagues.push(
            stripMetaFromResource<League>(r)
        )
    }
    return leagues;
}