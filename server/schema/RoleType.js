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
const { create } = require('axios');
const { authRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

const RoleType = new GraphQLObjectType({
    name: 'Role',
    description: "This node describes a Role for a list of users.",
    fields: () => {
        const { UserType } = require('./types');
        return {
        uuid:{
            type: GraphQLNonNull(GraphQLID)
        },
        name:{
            type: GraphQLNonNull(GraphQLString),
            description:"The name of the role."
        },
        users: {    // TODO: check the type here. Apparently, GraphQLList is not a GraphQL Type.
            type: GraphQLNonNull(GraphQLList(UserType)),
            description:"List of users that have the role.",
            async resolve({ name }, args, ctx, info) {
                return await auth.get('/getUsersOfRole', {
                    params: { name },
                    headers: { authorization: ctx.headers.authorization },
                }).then(res => res.data);
            }
        }}
    }
});

module.exports = RoleType;