/**
 * The Mutation node serves as a mutable entrypoint to the graph.
 * It contains fields which we can use for traversing through the graph
 * and performing write, update and delete operations.
 */
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const { RoleType, UserType } = require('./types');
const { create } = require('axios');
const { authRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
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
                    headers: { authorization: ctx.headers.authorization }
                }).then(res => res.data);
            }
        },
        updateUser: {

        },
        deleteUser: {

        },
        createRole: {

        },
        deleteRole: {

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
                    headers: { authorization: ctx.headers.authorization }
                }).then(res => res.data.role);
            }
        },
        // publishPost(input MakePost)
        // adding mutations will be subject to frontend requirements for now.
    }
})

module.exports = MutationType;