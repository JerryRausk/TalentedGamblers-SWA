import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
import { LeagueMembership } from "../types/league.js";
import { getUserDetailsQuery } from "../queries/getUserDetailsQuery.js";
import { addInvitedUserCommand } from "../commands/addInvitedUserCommand.js";
import { InvitedUser } from "../types/dbTypes.js";
async function callHandler(request: HttpRequest, __: InvocationContext, user: User, ___: LeagueMembership[]): Promise<HttpResponseInit> {
    const userDetails = await getUserDetailsQuery(user.email);
    if(!userDetails.isSiteAdmin) {
        return { status: 401, jsonBody: {success: false}}
    }

    const userToInvite = await request.json() as InvitedUser
    const commandRes = await addInvitedUserCommand({
        id: userToInvite.id
    })
    if(!commandRes) {
        return { status: 500, jsonBody: {success: false}}
    }

    return { status: 201, jsonBody: {success: true}}
}

export async function addInvitedUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('addInvitedUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: addInvitedUser
});
