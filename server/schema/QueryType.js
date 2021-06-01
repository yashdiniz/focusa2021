/**
 * The Query node serves as an immutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and obtaining information.
 */
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt
} = require('graphql');
const { create } = require('axios');
const { authRealm, profileRealm, postRealm, coursesRealm } = require('../config');
const { onError } = require('./types');

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
const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});
const { RoleType, UserType, ProfileType, PostType, CourseType } = require('./types');

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
                    if (id)    // prioritizing id over name
                        return await auth.get('/getUserById', {
                            params: { id },
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                            .catch(onError);
                    else if (name)
                        return await auth.get('/getUserByName', {
                            params: { name },
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                            .catch(onError);
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
                    if (id)    // prioritizing id over name
                        return await auth.get('/getRoleById', {
                            params: { id },
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                            .catch(onError);
                    else if (name)
                        return await auth.get('/getRoleByName', {
                            params: { name },
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                            .catch(onError);
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
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                        .catch(onError);
                }
            },
            isSubscribed: {
                type: GraphQLBoolean,
                description: "Check if a User is subscribed to a Course.",
                args: {
                    userID: { type: GraphQLNonNull(GraphQLID) },
                    courseID: { type: GraphQLNonNull(GraphQLID) },
                },
                async resolve(_, { userID, courseID }, ctx) {
                    return await profile.get('/profileHasInterest', {
                        params: { userID, courseID },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data ? true : false)
                    .catch(e => {
                        if (e.response?.status == 404) return false;  // will throw 404 if profile not have interest.
                        else onError(e);
                    });
                }
            },
            post: {
                type: PostType,
                description: "Get the Post with a matching ID.",
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) },
                },
                async resolve(_, { id }, ctx) {
                    return await post.get('/getPostById', {
                        params: { id },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                        .catch(onError);
                }
            },
            posts: {
                type: GraphQLList(PostType),
                description: "Get a list of Posts with a matching search query.",
                args: {
                    q: { type: GraphQLString },
                    offset: { type: GraphQLInt }
                },
                async resolve(_, { q, offset }, ctx) {
                    return await post.get('/searchPosts', {
                        params: { q, offset },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                        .catch(onError);
                }
            },
            course: {
                type: CourseType,
                description: "Get the Course with a matching ID.",
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) },
                },
                async resolve(_, { id }, ctx) {
                    return await courses.get('/getCourseById', {
                        params: { id },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                        .catch(onError);
                }
            },
            courses: {
                type: GraphQLList(CourseType),
                description: "Get a list of Courses with matching names.",
                args: {
                    name: { type: GraphQLString },
                },
                async resolve(_, { name }, ctx) {
                    if (name)
                        return await courses.get('/getCoursesByName', {
                            params: { name, offset: 0 },
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                            .catch(onError);
                }
            }
        }
    }
})

module.exports = QueryType;
