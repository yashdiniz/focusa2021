/**
 * 
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');
const UserType = require('./UserType');
const CourseType = require('./CourseType');

const PostType = new GraphQLObjectType({
    type: 'Post',
    description: "This node holds all Post details, and references to their comments.",
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        time: {
            type: GraphQLNonNull(GraphQLString),
            description: "The time of publication, as a Date object String.",
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
            description: "The Post body, written in markdown."
        },
        author: {
            type: GraphQLNonNull(UserType),
            description: "The Post author details.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
    }
});

module.exports = PostType;