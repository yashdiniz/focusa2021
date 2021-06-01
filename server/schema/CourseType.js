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
const { authRealm, profileRealm, postRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const profile = create({
    baseURL: `${profileRealm}`,
    timeout: 5000,
});
const post = create({
    baseURL: `${postRealm}`,
    timeout: 5000,
});

const CourseType = new GraphQLObjectType({
    name:'Course',
    descrption: "This node stores details of all the possible courses.",
    fields: () => {
        const { RoleType, PostType, ProfileType, onError } = require('./types');
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
                            headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                        }).then(res => res.data)
                        .catch(onError);
                    })
                }
            },
            description: {
                type: GraphQLString,
                description: "Course Description."
            },
            subscribers: {
                type: GraphQLList(ProfileType),
                description: "Users subscribed to the course.",
                args:{
                    offset: { type: GraphQLInt },
                },
                async resolve({ uuid }, { offset }, ctx, info){
                    return await profile.get('/getProfilesWithInterest', {
                        params: { courseID: uuid, offset, },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip },
                    }).then(res => res.data)
                    .catch(onError);
                }
            },
            posts: {
                type: GraphQLList(PostType),
                description: "Posts published in this Course.",
                args: {
                    offset: { type: GraphQLInt }
                },
                async resolve({ uuid }, { offset }, ctx) {
                    return await post.get('/getPostsByCourse', {
                        params: { id: uuid, offset },
                        headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                    .catch(onError);
                }
            }
        }
    }
});

module.exports = CourseType;