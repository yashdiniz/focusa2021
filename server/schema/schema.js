/**
 * This file contains the GraphQL Schema, and simply
 * serves as an entrypoint to the schema code.
 */
const { GraphQLSchema } = require('graphql');
const query = require('./QueryType');
const mutation = require('./MutationType');
const subscription = require('./SubscriptionType');

// TODO: graphql subscription support yet to be added to package by the third-party...
// Until then, trying out matrix server https://howto.lintel.in/voip-matrix-js-sdk/

module.exports = new GraphQLSchema({
    query,
    mutation,
    subscription,
});