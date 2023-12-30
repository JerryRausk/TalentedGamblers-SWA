import { Container, CosmosClient } from "@azure/cosmos";
import { ItemType, itemTypes } from "../itemTypes";
const DBNAME = process.env.CosmosDBName;
const CONTAINERNAME = process.env.CosmosContainerName;

export async function getItemOrNullById<T>(id: string, type: ItemType): Promise<T | null> {
    /* 
        If no partitionKey is provided, id will be used as partitionKey. 
        If found in db removes all _ props (metadata from cosmos) and returns it, else returns null. 
    */
    const partitionKey = itemTypes[type];
    const container = await getContainer()
    const i = await container.item(id, partitionKey).read();
    if (i.statusCode === 200) return stripMetaFromResource<T>(i.resource);
    return null;
}

export async function getCosmosClient() {
    const endpoint = process.env.CosmosUrl;
    const key = process.env.CosmosKey;
    return new CosmosClient({ endpoint, key })
}

export async function getContainer() {
    const client = await getCosmosClient()
    const db = client.database(DBNAME)
    return db.container(CONTAINERNAME)
}

export function stripMetaFromResource<T>(resource: any) {
    return Object.entries(resource).reduce((acc, [key, val]) => {
        if (!key.startsWith("_")) return { ...acc, [key]: val }
        else return acc
    }, {}) as T
}