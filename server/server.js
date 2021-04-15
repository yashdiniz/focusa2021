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
    subscriptions: '/subscriptions',
    uploads: false,
    context: ({ req, connection }) => {
        if(connection) return connection;       // if WebSocket
        else return req;
    }
})

server.listen(port).then(({ url })=> {
    console.warn(`GraphQL listening on ${ url }`);
});

//logging
var onOperation = function (message, params, WebSocket) {
    console.log('subscriptionServer' + message.payload, params);
    return Promise.resolve(Object.assign({}, params, { context: message.payload.context }))
}
//logging
var onConnect = function (connectionParams, WebSocket) {
    console.log('connecting ....')
}
//logging
var onDisconnect = function (WebSocket) {
    console.log('disconnecting ...')
}

require('./services/auth/index');   // importing the auth service (strictly for auth purposes)
require('./services/profile/index');    // import the profile service  
require('./services/courses/index');// importing the courses service
require('./services/posts/index');