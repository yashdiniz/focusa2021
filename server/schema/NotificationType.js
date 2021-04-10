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
                type: GraphQLNonNull(GraphQLInt),
                description: "The time of publication, as a Date object String.",
            },
            channel: {
                type: GraphQLNonNull(GraphQLString),
                description: "The events occured, as a event object String.",
            },
            course: {
                type: (CourseType),
                description: "The course detail, as a courses object Id.",
                async resolve({ course },_, ctx) {
                    return await courses.get('/getCourseById', {
                        params: { id: course },
                        headers: { authorization: ctx.headers?.authorization, realip: ctx.ip }
                    }).then(res => res.data)
                }
            },
            body: {
                type: GraphQLNonNull(GraphQLString),
                description: "Description of notification, as a body object String.",
            },
            link: {
                type: GraphQLNonNull(GraphQLString),
                description: "Link for notification, as a link object String.",
            },
        }
    }
});

module.exports = NotificationType;