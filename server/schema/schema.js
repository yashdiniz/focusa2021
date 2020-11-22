/**
 * This file contains the GraphQL Schema, and simply
 * serves as an entrypoint to the schema code.
 */
const { GraphQLSchema } = require('graphql');
const query = require('./QueryType');
const mutation = require('./MutationType');

module.exports = new GraphQLSchema({
    query,
    mutation,
});