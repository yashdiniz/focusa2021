const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLID,
    GraphQLInt
} = require('graphql');

const NotificationType = new GraphQLObjectType({
    name : "Notification",
    description : "todo",
    fields: () => {
        const { CourseType } = require('./types');
        return  {
            uuid: {
                type: GraphQLNonNull(GraphQLID),
            },
            time: {
                type: GraphQLNonNull(GraphQLString),
                description: "Timestamp of the notification.",
            },
            channel: {
                type: GraphQLNonNull(GraphQLString),
                description: "The event which triggered the notification.",
            },
            course: {
                type: (CourseType),
                description: "The course details.",
                async resolve({ course },_, ctx) {
                    return await courses.get('/getCourseById', {
                        params: { id: course },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                }
            },
            body: {
                type: GraphQLNonNull(GraphQLString),
                description: "The notification body.",
            },
            link: {
                type: GraphQLNonNull(GraphQLString),
                description: "The URL to redirect to when the notification is clicked.",
            },
        }
    }
});

module.exports = NotificationType;