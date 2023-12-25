import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares, Permission } from "../middleware/middlewares.js";
import { User } from "@auth0/auth0-vue";
async function callHandler(request: HttpRequest, context: InvocationContext, user: User, permissions: Permission[]): Promise<HttpResponseInit> {
    context.log(`Callback was reached with user ${user} and permissions ${permissions}`)
    return { body: `Hello, ${user.email}!` };
}

export async function getLeagues(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return addMiddleWares(request, context, callHandler)
};

app.http('getLeagues', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getLeagues
});
