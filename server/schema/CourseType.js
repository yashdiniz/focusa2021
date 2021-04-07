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
    GraphQLList,
    GraphQLInt
} = require('graphql');
const { create } = require('axios');
const { postRealm } = require('../config');

const post = create({
    baseURL: `${postRealm}`,
    timeout: 5000,
});

const CourseType = new GraphQLObjectType({
    name:'Course',
    descrption: "This node stores details of all the possible courses.",
    fields: () => {
        const { UserType, RoleType, PostType } = require('./types');
        return {
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
            },
            posts: {
                type: GraphQLList(PostType),
                description: "TODO",
                args: {
                    offset: { type: GraphQLInt }
                },
                async resolve({ uuid }, { offset }, ctx) {
                    return await post.get('/getPostsByCourse', {
                        params: { id: uuid, offset },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data);
                }
            }
        }
    }
});

module.exports = CourseType;