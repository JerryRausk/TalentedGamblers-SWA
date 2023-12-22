import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Authenticate } from "../middleware/auth";
import { User } from "@auth0/auth0-vue";

async function callHandler(request: HttpRequest, context: InvocationContext, user: User): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'worldddd';

    return { body: `Hello, ${name}!` };
}

export async function getLeagues(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return Authenticate(request, context, callHandler)
};

app.http('getLeagues', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getLeagues
});
