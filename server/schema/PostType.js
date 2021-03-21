/**
 * The Post node holds all Post details, and references to their comments.
 * It includes time of publishing, post body, post parent, and course as well.
 */
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: "This node holds all Post details, and references to their comments.",
    fields: () => {
        const { UserType, CourseType } = require('./types');
        return {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        time: {
            type: GraphQLNonNull(GraphQLString),
            description: "The time of publication, as a Date object String.",
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
            description: "The Post body, written in markdown.",
        },
        author: {
            type: GraphQLNonNull(UserType),
            description: "The Post author details.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        parent: {
            type: PostType,
            description: "ID of the parent post. Null by default. No edits allowed.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        attachmentURL: {
            type: GraphQLString,
            description: "The Post attachment URL. Null by default. No edits allowed.",
        },
        course: {
            type: CourseType,
            description: "The course under which the post belongs. Null be default. No edits allowed.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        comments: {
            type: GraphQLNonNull(GraphQLList(PostType)),
            description: "A list containing all comments made under the Post.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
        reported: {
            type: GraphQLBoolean,
            description: "Flag signifying the post has been reported.",
        },
        approved: {
            type: GraphQLBoolean,
            description: "Flag signifying the post has been approved.",
        }}
    }
});

module.exports = PostType;