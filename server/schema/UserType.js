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
const ProfileType = require('./ProfileType');
const PostType = require('./PostType');
const RoleType = require('./RoleType');

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "This node holds all the necessary user details.",
    fields: () => ({
        uuid: { 
            type: GraphQLNonNull(GraphQLID),
        },
        name: { 
            type: GraphQLNonNull(GraphQLString),
            description: "A unique username.",
        },
        // profile: { 
        //     type: ProfileType,
        //     description: "Profile that maps to this User.",
        //     resolve(parent, args, ctx, info) {
        //         // currently stub, return null
        //     }
        // },
        // posts: {
        //     type: GraphQLNonNull(GraphQLList(PostType)),
        //     description: "Posts written by this Person.",
        //     resolve(parent, args, ctx, info) {
        //         // currently stub, return null
        //     }
        // },
        // roles: {
        //     type: GraphQLNonNull(GraphQLList(RoleType)),
        //     description: "Roles that the User is assigned.",
        //     resolve(parent, args, ctx, info) {
        //         // currently stub, return null
        //     }
        // },
    })
});

module.exports = UserType;