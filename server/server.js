const { port, graphiql } = require('./config');
const { ApolloServer } = require('apollo-server');
const schema = require('./schema/schema');

process.title = "FOCUSA";

// TODO: store the timestamp as part of logs!! (i.e. timestamp at every change)
// TODO: also store the IP address in the logs of the for listing.
// TODO: also store the user-agent and other possibly fingerprintable information.

const server = new ApolloServer({
    schema, // ES6, key:value pair coupling
    graphiql, // use the dev playground for now
    subscriptions: {
        path: '/subscriptions',
        onOperation,
        onConnect: (params, ws, ctx) => {
            return {
                cookie: ctx.request.headers.cookie,
                ip: ctx.request.socket.remoteAddress,
                authorization: params.authorization,
            };
        }
    },
    uploads: false,
    context: ({ req, connection }) => {
        if(connection) {       // if WebSocket
            return {
                headers: { authorization: connection.context?.authorization, cookie: connection.context?.cookie },
                ip: connection.context?.ip,
            };
        }
        else return req;
    }
})

server.listen(port).then(({ url })=> {
    console.warn(Date.now(), `GraphQL listening on ${ url }`);
});

//logging
var onOperation = function (message, params, WebSocket) {
    console.log(Date.now(), 'subscriptionServer:', message.payload, params);
    return Promise.resolve(Object.assign({}, params, { context: message.payload.context }))
}

require('./services/auth/index');   // importing the auth service (strictly for auth purposes)
require('./services/profile/index');    // import the profile service  
require('./services/courses/index');// importing the courses service
require('./services/posts/index');
require('./services/notifications/index');