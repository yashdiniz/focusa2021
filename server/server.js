const { port, graphiql } = require('./config');
const express = require('express');
const { ApolloServer } = require('apollo-server');
// const { graphqlHTTP } = require('express-graphql'); // importing the adapter middleware
const schema = require('./schema/schema');

process.title = "FOCUSA graphQL";

// TODO: store the timestamp as part of logs!! (i.e. timestamp at every change)
// TODO: also store the IP address in the logs of the for listing.
// TODO: also store the user-agent and other possibly fingerprintable information.

const server = new ApolloServer({
    schema, // ES6, key:value pair coupling
    graphiql, // use the dev playground for now
    subscriptions: '/subscriptions',
    uploads: false,
    context: ({ req, connection }) => {
        if(connection) {        // if WebSocket
            let token = connection.context.authorization || "";
            return { token };
        } else {
            return req;
        }
    }
})

server.listen(port).then(({ url })=> {
    console.warn(`GraphQL listening on ${ url }`);
});

require('./services/auth/index');   // importing the auth service (strictly for auth purposes)
require('./services/profile/index');    // import the profile service  
require('./services/courses/index');// importing the courses service
require('./services/posts/index');