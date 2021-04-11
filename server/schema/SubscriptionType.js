const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

const { PubSub } = require('graphql-subscriptions');
const { focusa } = require('../services/databases');
const pubsub = new PubSub();
const NotificationType = require('./NotificationType');

const SubscriptionType = new GraphQLObjectType({
    name: "Subscription",
    description: "todo",
    fields: {
        postAdded: {
            type: GraphQLNonNull(NotificationType),
            description: "todo",
            resolve(parent, args, ctx, info) {
                return parent;
            },
            subscribe(parent, args, ctx, info) {
                let iterator = pubsub.asyncIterator(['new_post']);
                return iterator;
            }
        }
    }
});

focusa.then(c => c.posts.insert$
    .subscribe(doc =>
        pubsub.publish('new_post', {
            uuid: doc.uuid,
            time: doc.time,
            channel: doc.channel,
            course: doc.course,
            body: doc.body,
            link: doc.link
        })
    )
);

module.exports = SubscriptionType;