/**
 * Course node holds all the necessary course details
 */

const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNotNull,
    GraphQLList
} = graphql;

const UserType = require('./UserType');
const RoleType = require('./RoleType');

const CourseType = new GraphQLObjectType({
    name:'Course',
    descrption: "This node stores all the possible course types",
    fields: {
        id: {
            type: GraphQLNotNull(GraphQLID)
        },
        course: {
            type: GraphQLNotNull(GraphQLString),
            description: "Name of the course"
        },
        mods:{
            type: GraphQLNotNull(GraphQLList(GraphQLNotNull(RoleType))),
            description: "Moderators for the course",
            resolve(parent, args, ctx, info){
                // currently stub, return null
            }
        },
        description: {
            type: GraphQLString,
            description: "Course Description"
        },
        subscribers: {
            type: GraphQLList(UserType),
            description: "Users subscribed to the course",
            resolve(parent, args, ctx, info){
                // currently stub, return null
            }
        }
    }
});

module.exports = CourseType;