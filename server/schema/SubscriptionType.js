const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

const { PubSub, withFilter } = require('apollo-server');
const { create } = require('axios');
const { verify } = require('../services/jwt');
const pubsub = new PubSub();
const NotificationType = require('./NotificationType');
const { profileRealm, authRealm } = require('../config');
const { onError } = require('./types');

const p2p = require('../libp2p-pubsub');
const notification = new p2p.PubSub();

const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});
const profile = create({
    baseURL: `${profileRealm}`,
    timeout: 5000,
});

const SubscriptionType = new GraphQLObjectType({
    name: "Subscription",
    description: "todo",
    fields: {
        postAdded: {
            type: GraphQLNonNull(NotificationType),
            description: "todo",
            subscribe: withFilter(
                () => {
                    return pubsub.asyncIterator(['postAdded'])
                },
                async (payload, _, ctx) => {   // filter notifications to client based on arguments sent
                    let token = await auth.get('/check', {  // cannot use JWT here since it will time out!
                        headers: { cookie: ctx.headers.cookie } // thus using cookies to obtain the latest JWT from auth
                    }).then(res => res.data?.token);

                    let sess = verify(token.replace('Bearer ', ''));

                    return await profile.get('/getProfile', {
                        params: { id: sess.uuid }, // check the profile ID of the user session...
                        headers: { authorization: token, realip: ctx.ip }
                    }).then(res => {
                        let interests = res.data?.interests;
                        return interests.includes(payload.postAdded.course);
                    })
                    .catch(onError);
                },
            )
        }
    }
});

notification.subscribe('postAdded', payload => {
    // TODO: still performing a forwarding, not the expected way to pubsub.
    pubsub.publish('postAdded', {
        postAdded: { uuid: payload.uuid, time: payload.time,
        channel: payload.channel, course: payload.course,
        body: payload.body, link: payload.link }
    });
});

module.exports = SubscriptionType;