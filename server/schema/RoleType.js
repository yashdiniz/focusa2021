/**
 * The Role node stores and defines the role for a particular list of User accounts.
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');
const UserType = require('./UserType');

const RoleType = new GraphQLObjectType({
    name: 'Role',
    description: "This node describes a Role for a list of users.",
    fields: {
        id:{
            type: GraphQLNonNull(GraphQLID)
        },
        name:{
            type: GraphQLNonNull(GraphQLString),
            description:"The name of the role."
        },
        users:{
            type: GraphQLList(UserType),
            description:"List of users that have the role.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        }
    }
});

module.exports = RoleType;