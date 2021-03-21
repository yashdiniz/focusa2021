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
} = require('graphql');
const { create } = require('axios');
const { authRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This node holds all the necessary user details.",
    fields: () => {
        const { ProfileType, PostType, RoleType } = require('./types');
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
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        posts: {
            type: GraphQLNonNull(GraphQLList(PostType)),
            description: "Posts written by this Person.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        roles: {
            type: GraphQLNonNull(GraphQLList(RoleType)),
            description: "Roles that the User is assigned.",
            async resolve(parent, args, ctx, info) {
                return await auth.get('/getRolesOfUser', {
                    params: { name: parent['name'] },
                    headers: { authorization: ctx.headers.authorization },
                }).then(res => res.data);
            }
        }}
    }
});

module.exports = UserType;