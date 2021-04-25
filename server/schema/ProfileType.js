/**
 * The Profile node holds additional information,
 * like the display picture, full name, about, and interests.
 * The profile is isolated from the User for shorter queries.
 */
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
} = require('graphql');
const { create } = require('axios');
const { authRealm, profileRealm, coursesRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});
const profile = create({
    baseURL: `${profileRealm}`,
    timeout: 5000,
});

const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    description: "This node holds additional information related to a User.",
    fields: () => {
        const { CourseType, UserType } = require('./types');
        return {
        userID: {
            type: GraphQLNonNull(GraphQLID),
        },
        user: {
            type: GraphQLNonNull(UserType),
            description: "User that maps to this profile.",
            async resolve({ userID }, args, ctx) {
                return await auth.get('/getUserById', {
                    params: { id: userID },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data);
            }
        },
        fullName: {
            type: GraphQLNonNull(GraphQLString),
            description: "The full name of the profile.",
        },
        display_pic: {
            type: GraphQLNonNull(GraphQLString),
            description: "URL to the display picture of the profile.",
        },
        interests: {
            type: GraphQLNonNull(GraphQLList(CourseType)),
            description: "The list of courses the user has subscribed to.",
            async resolve({ interests }, args, ctx, info) {
                return await Promise.all(interests.map(async doc => await courses.get('/getCourseById', {
                    params: { id: doc },
                    headers: { authorization: ctx.headers.authorization, realip: ctx.ip }
                }).then(res => res.data)));
            }
        }}
    }
});

module.exports = ProfileType;