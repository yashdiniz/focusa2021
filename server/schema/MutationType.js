/**
 * The Mutation node serves as a mutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and performing write, update and delete operations.
 */
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');
const { RoleType, UserType, ProfileType, PostType } = require('./types');
const { create } = require('axios');
const { authRealm, profilePort, profileRealm, postRealm } = require('../config');

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

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: "This node serves as a mutable entrypoint to the graph. It contains fields which we can use for traversing through the graph and performing write, update and delete operations.",
    fields: {
        createUser: {
            type: UserType,
            description: "Create User with given credentials.",
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { username, password }, ctx) {
                return await auth.get('/createUser', {
                    params: { username, password },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        updateUser: {
            type: UserType,
            description: "Update User details to given credentials.",
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                newPassword: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { username, newPassword }, ctx) {
                return await auth.get('/updateUser', {
                    params: { username, password: newPassword },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        deleteUser: {
            type: UserType,
            description: "Delete User of given credentials.",
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { username }, ctx) {
                return await auth.get('/deleteUser', {
                    params: { username },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        createRole: {
            type: RoleType,
            description: "Create Role with given name.",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { name }, ctx) {
                return await auth.get('/createRole', {
                    params: { name },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                })
            }
        },
        deleteRole: {
            type: RoleType,
            description: "Delete Role of given name.",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { name }, ctx) {
                return await auth.get('/deleteRole', {
                    params: { name },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                })
            }
        },
        giveRole: {
            type: RoleType,
            description: "Give Role to a User.",
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { username, role }, ctx) {
                return await auth.get('/giveRole', {
                    params: { username, role },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data.role);
            }
        },
        updateProfile: {
            type: ProfileType,
            description: "Updates the Profile according to arguments.",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                fullName: { type: GraphQLNonNull(GraphQLString) },
                about: { type: GraphQLNonNull(GraphQLString) },
                display_pic: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, { id, fullName, about, display_pic }, ctx) {
                return await profile.get('/updateProfile', {
                    params: { id, fullName, about, display_pic, },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        deleteProfile: {
            type: ProfileType,
            description: "Deletes the Profile according to the ID.",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { id }, ctx) {
                return await profile.get('/deleteProfile', {
                    params: { id },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        createPost: {
            type: PostType,
            description: "TODO",
            args: {
                text: { type: GraphQLNonNull(GraphQLString),
                    description: "The text body of the post. Supports markdown." },
                course: { type: GraphQLNonNull(GraphQLID),
                    description: "The Course ID the post should be added under." },
                attachmentURL: { type: GraphQLString,
                    description: "URL to attach to the post." },
                parent: { type: GraphQLID, 
                    description: "ID of the parent post. To be added only if the post currently being created is a comment." },
            },
            async resolve(_, { text, course, attachmentURL, parent }, ctx) {
                return await post.get('/createPost', {
                    params: { text, course, attachmentURL, parent },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        editPost: {
            type: PostType,
            description: "TODO",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                text: { type: GraphQLNonNull(GraphQLString),
                    description: "The text body of the post. Supports markdown." },
            },
            async resolve(_, { id, text }, ctx) {
                return await post.get('/editPost', {
                    params: { id, text },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        deletePost: {
            type: PostType,
            description: "TODO",
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(_, { id }, ctx) {
                return await post.get('/deletePost', {
                    params: { id },
                    headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        }
        // adding mutations will be subject to frontend requirements for now.
    }
})

module.exports = MutationType;