const { port } = require('./config');
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // importing the adapter middleware
const schema = require('./schema/schema');

const app = express();  // create a router

// let the /graphql endpoint use the graphql adapter middleware
app.use('/graphql', graphqlHTTP({
    schema, // ES6, key:value pair coupling
    graphiql: true, // use the dev playground for now
}));

app.listen(port, ()=> {
    console.warn(`Listening on ${ port }`);
});