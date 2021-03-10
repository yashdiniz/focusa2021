const { port, graphiql } = require('./config');
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // importing the adapter middleware
const schema = require('./schema/schema');

process.title = "FOCUSA graphQL";

const app = express();  // create a router

require('./services/auth/index');   // importing the auth service (strictly for auth purposes)  

// let the /graphql endpoint use the graphql adapter middleware
app.use('/graphql', graphqlHTTP({
    schema, // ES6, key:value pair coupling
    graphiql, // use the dev playground for now
}));

app.listen(port, ()=> {
    console.warn(`Listening on ${ port }`);
});