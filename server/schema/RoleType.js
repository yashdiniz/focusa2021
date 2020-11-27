/**
 * RoleType node stores and defines the role for a particular list of user profiles
 */
const graphql = require('graphql');

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull, GraphQLList} = graphql;

const UserType = require('./UserType');

const RoleType = new GraphQLObjectType({
    name: 'Role',
    description: "This node describes a role for a list of users",
    fields: {
        id:{
            type: GraphQLNonNull(GraphQLID)
        },
        role:{
            type: GraphQLNonNull(GraphQLString),
            description:"Defines the role"
        },
        users:{
            type: GraphQLList(UserType),
            description:"List of users that have this RoleType",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        }
    }
});

module.exports = RoleType;