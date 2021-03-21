/**
 * The Query node serves as an immutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and obtaining information.
 */
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLID 
} = require('graphql');
const { create } = require('axios');
const { authRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

const { RoleType, UserType } = require('./types');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: "This node serves as an immutable entrypoint to the graph. It contains fields which we can use for traversing through the graph and obtaining information.",
    fields: {
        token: {
            type: GraphQLString,
            description: "Echoes the authorization token of the user.",
            resolve(_, args, ctx) {
                return ctx.headers.authorization;
            }
        },
        user: {
            type: UserType,
            description: "Gets the details of the User mentioned in arguments.",
            args: {
                name: { type: GraphQLString },
                id: { type: GraphQLID },
            },
            async resolve(_, { id, name }, ctx) {
                if(id)    // prioritizing id over name
                    return await auth.get('/getUserById', {
                        params: { id },
                        headers: { authorization: ctx.headers.authorization }
                    }).then(res => res.data);
                if(name) 
                    return await auth.get('/getUserByName', {
                        params: { name },
                        headers: { authorization: ctx.headers.authorization }
                    }).then(res => res.data);
            }
        },
        role: {
            type: RoleType,
            description: "Gets the details of the Role mentioned in arguments.",
            args: {
                name: { type: GraphQLString },
                id: { type: GraphQLID },
            },
            async resolve(_, { id, name }, ctx) {
                if(id)    // prioritizing id over name
                    return await auth.get('/getRoleById', {
                        params: { id },
                        headers: { authorization: ctx.headers.authorization }
                    }).then(res => res.data);
                if(name) 
                    return await auth.get('/getRoleByName', {
                        params: { name },
                        headers: { authorization: ctx.headers.authorization }
                    }).then(res => res.data);
            }
        },
        // getProfile(ID)
        // getCourse(ID)
        // searchCourses(string search query)
        // getPost(ID)
        // searchPosts(string search query)
    }
})

module.exports = QueryType;
