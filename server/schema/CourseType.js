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
const UserType = require('./UserType');
const RoleType = require('./RoleType');

const CourseType = new GraphQLObjectType({
    name:'Course',
    descrption: "This node stores details of all the possible courses.",
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID)
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: "Name of the course."
        },
        mods:{
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(RoleType))),
            description: "Moderator roles for the course.",
            resolve(parent, args, ctx, info){
                // currently stub, return null
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
        }
    })
});

module.exports = CourseType;