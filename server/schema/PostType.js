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
const { create } = require('axios');
const { coursesRealm } = require('../config');

const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});

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
            async resolve({ uuid }, args, ctx, info) {
                return await auth.get('/getUserById', {
                    params: { id: uuid },
                    headers: { authorization: ctx.headers.authorization }
                }).then(res => res.data);
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
            description: "The course under which the post belongs. Null by default. No edits allowed.",
            async resolve({ uuid }, args, ctx, info) {
                return await courses.get('/getCourseById', {
                    params: { id: uuid },
                    headers: { authorization: req.headers?.authorization }
                }).then(res => res.data);
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