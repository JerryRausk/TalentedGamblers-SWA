import { itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";
import { LeagueMembership } from "../types/league.js";
import { cache } from "../services/cache.js";

export async function getLeagueMembersQuery(leagueId: string) {
  const cacheKey = `${itemTypes.LeagueMembership}-${leagueId}`
  const cachedMembers = cache.get<LeagueMembership[]>(cacheKey);
  if (cachedMembers) {
    console.log("Returning cached league members for leagueId ", leagueId);
    return cachedMembers;
  }
  const container = await getContainer();
  const res = await container.items
    .query(
      {
        query: "SELECT * FROM c WHERE c.leagueId = @leagueId",
        parameters: [{ name: "@leagueId", value: leagueId }]
      },
      { partitionKey: [itemTypes.LeagueMembership] }
    )
    .fetchAll();

  const members = res.resources.map(r => stripMetaFromResource<LeagueMembership>(r))
  console.log("Setting cached league members for leagueId ", leagueId);
  cache.set(cacheKey, members);
  return members;
}