/**
 * This file contains the GraphQL Schema, and simply
 * serves as an entrypoint to the schema code.
 */
const { GraphQLSchema } = require('graphql');
const query = require('./QueryType');
const mutation = require('./MutationType');
const subscription = require('./SubscriptionType');

module.exports = new GraphQLSchema({
    query,
    mutation,
    subscription,
});