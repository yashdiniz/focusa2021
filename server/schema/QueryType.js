/**
 * The Query node serves as an immutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and obtaining information.
 */
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLList,
    GraphQLID, 
    GraphQLInt
} = require('graphql');
const { create } = require('axios');
const { authRealm, profileRealm, postRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const profile = create({
    baseURL: `${profileRealm}`,
    timeout: 5000,
});
const post = create({
    baseURL: `${postRealm}`,
    timeout: 5000,
});
const { RoleType, UserType, ProfileType, PostType } = require('./types');

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: "This node serves as an immutable entrypoint to the graph. It contains fields which we can use for traversing through the graph and obtaining information.",
    fields: () => {
        return {
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
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data);
                else if(name) 
                    return await auth.get('/getUserByName', {
                        params: { name },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
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
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data);
                else if(name) 
                    return await auth.get('/getRoleByName', {
                        params: { name },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data);
            }
        },
        profile: {
            type: ProfileType,
            description: "Gets the details of the Profile mentioned in arguments.",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { id }, ctx) {
                return await profile.get('/getProfile', {
                    params: { id },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        post: {
            type: GraphQLList(PostType),
            description: "TODO",
            args: {
                id: { type: GraphQLID },
                q: { type: GraphQLString },
                offset: { type: GraphQLInt }
            },
            async resolve(_, { id, q, offset }, ctx) {
                if(id)
                    return [await post.get('/getPostById', {
                        params: { id },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data)];
                else if(q) {
                    return await post.get('/searchPosts', {
                        params: { q, offset },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data);
                }
            }
        }
        // getCourse(ID)
        // searchCourses(string search query)
        // searchPosts(string search query)
    }}
})

module.exports = QueryType;
