const { port } = require('./config');
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // importing the adapter middleware
const cookieParser = require('cookie-parser')();
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const schema = require('./schema/schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');

process.title = "FOCUSA";

// TODO: store the timestamp as part of logs!! (i.e. timestamp at every change)
// TODO: also store the IP address in the logs of the for listing.
// TODO: also store the user-agent and other possibly fingerprintable information.

const app = express();  // create a router
app.use(cookieParser);

// let the /graphql endpoint use the graphql adapter middleware
app.use('/graphql', graphqlHTTP({
    schema, // ES6, key:value pair coupling
    graphiql: { // use the dev playground for now
        subscriptionEndpoint: `ws://localhost:${ port }/subscriptions`,
    },
}));

const ws = createServer(app);

ws.listen(port, ()=> {
    console.warn(`GraphQL listening on ${ port }`);
    new SubscriptionServer({
        execute,
        subscribe,
        schema,
        onConnect, onOperation, onDisconnect
    }, {
        server: ws,
        path: '/subscriptions',
    });
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