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
    GraphQLInt,
} = require('graphql');
const { coursesRealm, authRealm, postRealm } = require('../config');

const {create} = require('axios');
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});
const post = create({
    baseURL: `${postRealm}`,
    timeout: 5000,
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: "This node holds all Post details, and references to their comments.",
    fields: () => {
        const { UserType, CourseType, onError } = require('./types');
        return {
        uuid: {
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
            async resolve({ author }, args, ctx, info) {
                return await auth.get('/getUserById', {
                    params: { id: author },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data)
                .catch(onError);
            }
        },
        parent: {
            type: PostType,
            description: "The parent post. Null by default. No edits allowed.",
            async resolve({ parent }, args, ctx, info) {
                if(parent)
                    return await post.get('/getPostById', {
                        params: { id: parent },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                    .catch(onError);
            }
        },
        attachmentURL: {
            type: GraphQLString,
            description: "The Post attachment URL. Null by default. No edits allowed.",
        },
        course: {
            type: CourseType,
            description: "The course under which the post belongs. Null by default. No edits allowed.",
            async resolve({ course }, args, ctx, info) {
                if(course)
                    return await courses.get('/getCourseById', {
                        params: { id: course },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip  }
                    }).then(res => res.data)
                    .catch(onError);
            }
        },
        comments: {
            type: GraphQLNonNull(GraphQLList(PostType)),
            description: "A list containing all comments made under the Post.",
            args: {
                offset: { type: GraphQLInt },
            },
            async resolve({ uuid }, { offset }, ctx, info) {
                return await post.get('/getPostsByParent', {
                    params: { id: uuid, offset },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data)
                .catch(onError);
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