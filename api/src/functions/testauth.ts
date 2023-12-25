import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { addMiddleWares } from "../middleware/middlewares.js";
export async function testauth(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return await addMiddleWares(request, context, (r, c, u, p) => {
        return { body: `Hello, ${u.name}, you are invited.` };
    })
};

app.http('testauth', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: testauth,
    extraOutputs: []
});