/**
 * The Query node serves as an immutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and obtaining information.
 */
const { GraphQLObjectType, GraphQLString } = require('graphql');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: "This node serves as an immutable entrypoint to the graph. It contains fields which we can use for traversing through the graph and obtaining information.",
    fields: {
        token: {
            type: GraphQLString,
            resolve(_, args, ctx) {
                return ctx.headers.authorization;
            }
        }
        // getProfile(ID)
        // getUser(ID)
        // getCourse(ID)
        // searchCourses(string search query)
        // getPost(ID)
        // searchPosts(string search query)
    }
})

module.exports = QueryType;