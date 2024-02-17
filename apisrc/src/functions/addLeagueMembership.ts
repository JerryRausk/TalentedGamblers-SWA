import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "../middleware/auth.js";
import { LeagueMembership, LeagueMembershipTypes } from "../types/league.js";
import { randomUUID } from "crypto";
import { addLeagueMembershipCommand } from "../commands/addLeagueMembershipCommand.js";

async function callHandler(request: HttpRequest, __: InvocationContext, user: User, requestingUserMemberships: LeagueMembership[]): Promise<HttpResponseInit> {
    const newMembership = await request.json() as LeagueMembership
    const canAddLeagueMembers = [LeagueMembershipTypes.Owner, LeagueMembershipTypes.Admin]
    const requestUserMembershipType = requestingUserMemberships.filter(l => l.leagueId === newMembership.leagueId)[0].leagueMembershipType
    if(canAddLeagueMembers.includes(requestUserMembershipType)) {
        const newMembershipWithId = {...newMembership, id: randomUUID()}
        const commandRes = await addLeagueMembershipCommand(newMembershipWithId);
        if(!commandRes) {
            return {status: 500, jsonBody: {success: false}}
        }
        return { status: 201, jsonBody: newMembershipWithId}
    }
    console.error("Could not add league membership: ", JSON.stringify(newMembership))
    return { status: 500, jsonBody: {success: false}}
}

export async function addLeagueMembership(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('addLeagueMembership', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addLeagueMembership
});
