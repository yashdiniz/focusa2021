/**
 * The Course node holds all the necessary course details.
 * This includes the list of moderator Roles, the course name, description,
 * and Users subscribed.
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

const CourseType = new GraphQLObjectType({
    name:'Course',
    descrption: "This node stores details of all the possible courses.",
    fields: () => {
        const { UserType, RoleType } = require('./types');
        return {
        uuid: {
            type: GraphQLNonNull(GraphQLID)
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "Name of the course."
        },
        mods:{
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(RoleType))),
            description: "Moderator roles for the course.",
            resolve({ mods }, args, ctx, info){
                return mods.map(async id => {
                    return await auth.get('/getRoleById', {
                        params: { id },
                        headers: { authorization: ctx.headers?.authorization }
                    }).then(res => res.data);
                })
            }
        },
        description: {
            type: GraphQLString,
            description: "Course Description."
        },
        subscribers: {
            type: GraphQLList(UserType),
            description: "Users subscribed to the course.",
            resolve(parent, args, ctx, info){
                // currently stub, return null
            }
        }}
    }
});

module.exports = CourseType;