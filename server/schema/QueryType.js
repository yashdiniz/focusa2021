/**
 * The Query node serves as an immutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and obtaining information.
 */
const { GraphQLObjectType } = require('graphql');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: "This node serves as an immutable entrypoint to the graph. \
    It contains fields which we can use for traversing through the graph \
    and obtaining information.",
    fields: {

    }
})

module.exports = QueryType;