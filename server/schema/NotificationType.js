const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLID,
    GraphQLInt
} = require('graphql');
const { create } = require('axios');
const { coursesRealm, authRealm } = require('../config');

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

const courses = create({
    baseURL: `${coursesRealm}`,
    timeout: 5000,
});

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
                    if (course) {
                        let token = await auth.get('/check', {  // cannot use JWT here since it will time out!
                            headers: { cookie: ctx.headers.cookie } // thus using cookies to obtain the latest JWT from auth
                        }).then(res => res.data?.token);

                        return await courses.get('/getCourseById', {
                            params: { id: course },
                            headers: { authorization: token, realip: ctx.ip }
                        }).then(res => res.data);
                    }
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