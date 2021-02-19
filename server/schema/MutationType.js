/**
 * The Mutation node serves as a mutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and performing write, update and delete operations.
 */
const { GraphQLObjectType } = require('graphql');

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: "This node serves as a mutable entrypoint to the graph. It contains fields which we can use for traversing through the graph and performing write, update and delete operations.",
    fields: {
        // publishPost(input MakePost)
        // adding mutations will be subject to frontend requirements for now.
    }
})

module.exports = MutationType;