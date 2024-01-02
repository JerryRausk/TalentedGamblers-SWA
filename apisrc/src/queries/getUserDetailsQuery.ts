import { SqlQuerySpec } from "@azure/cosmos";
import { UserDetails, itemTypes } from "../types/dbTypes.js";
import { getContainer, stripMetaFromResource } from "../services/cosmosService";

export async function getUserDetailsQuery(userId: string) {
    const q = {
        query: "SELECT * FROM c WHERE c.userId=@userId ", 
        parameters: [{name: "@userId", value: userId}]
    } satisfies SqlQuerySpec

    const container = await getContainer();
    const res = await container.items
        .query(q, {partitionKey: [itemTypes.UserDetails]})
        .fetchAll()

    if(res.resources.length > 0) {
        return stripMetaFromResource<UserDetails>(res.resources[0]);
    } else {
        return getDefualtUserDetails(userId)
    }
}

function getDefualtUserDetails(userId: string): UserDetails {
    return {
        id: "",
        userId,
        isSiteAdmin: false
    }
}