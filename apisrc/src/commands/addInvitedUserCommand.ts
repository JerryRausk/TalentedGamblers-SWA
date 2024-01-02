import { getContainer } from "../services/cosmosService.js";
import { InvitedUser, itemTypes } from "../types/dbTypes.js";


export async function addInvitedUserCommand(InvitedUser: InvitedUser) {
    const container = await getContainer();
    const { statusCode } = await container.items.create({...InvitedUser, "_type": itemTypes.InvitedUser})
    if(statusCode > 399) return false;
    return true;
}