/**
 * This node holds all the necessary user details.
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
} = require('graphql');
const ProfileType = require('./ProfileType');
const PostType = require('./PostType');
const RoleType = require('./RoleType');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This node holds all the necessary user details.",
    fields: {
        id: { 
            type: GraphQLID,
        },
        name: { 
            type: GraphQLString,
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
            type: GraphQLList(PostType),
            description: "Posts written by this Person.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        roles: {
            type: GraphQLList(RoleType),
            description: "Roles that the User is assigned.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        }
    }
});

module.exports = UserType;