/**
 * The User node holds all the necessary user details.
 * Security sensitive information like passhash and salt 
 * have not been added in the object. 
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
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

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This node holds all the necessary user details.",
    fields: () => {
        const { ProfileType, PostType, RoleType, onError } = require('./types');
        return {
        uuid: { 
            type: GraphQLNonNull(GraphQLID),
        },
        name: { 
            type: GraphQLNonNull(GraphQLString),
            description: "A unique username.",
        },
        profile: { 
            type: ProfileType,
            description: "Profile that maps to this User.",
            async resolve({ uuid }, args, ctx, info) {
                return await profile.get('/getProfile', {
                    params: { id: uuid },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data)
                .catch(onError);
            }
        },
        posts: {
            type: GraphQLNonNull(GraphQLList(PostType)),
            description: "Posts written by this Person.",
            args: {
                offset: { type: GraphQLInt },
            },
            async resolve({ uuid }, { offset }, ctx, info) {
                return await post.get('/getPostsByAuthor', {
                    params: { id: uuid, offset },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data)
                .catch(onError);
            }
        },
        roles: {
            type: GraphQLNonNull(GraphQLList(RoleType)),
            description: "Roles that the User is assigned.",
            async resolve({ name }, args, ctx, info) {
                return await auth.get('/getRolesOfUser', {
                    params: { name },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip },
                }).then(res => res.data)
                .catch(onError);
            }
        }}
    }
});

module.exports = UserType;