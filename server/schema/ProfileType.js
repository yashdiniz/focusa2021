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
const UserType = require('./UserType');
const CourseType = require('./CourseType');

const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    description: "This node holds additional information related to a User.",
    fields: {
        id: {
            type: GraphQLNonNull(GraphQLID),
        },
        user: {
            type: GraphQLNonNull(UserType),
            description: "User that maps to this profile.",
            resolve(parent, args, ctx, info) {
                // currently stub, return null
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
            resolve(parent, args, ctx, info) {
                // currently stub, return null
            }
        },
    }
});

module.exports = ProfileType;