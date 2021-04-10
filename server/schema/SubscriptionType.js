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
    fields: () => {
        return {
            postAdded: {
                type: NotificationType,
                description: "todo",
                // create a post added subscription resolver function.
                async resolve(_, __, ctx) {
                    let iterator = pubsub.asyncIterator('new_post');
                    return iterator;  // subscribe to changes in a topic
                }
            }
        }
    }
});

pubsub.asyncIterator('new_post').next(data => {
    console.log('Outer Async Iterator', data);
});

focusa.then(c => c.posts.insert$
    .subscribe(doc =>
        pubsub.publish('new_post', {
            postAdded: {
                uuid: doc.uuid,
                time: doc.time,
                channel: doc.channel,
                course: doc.course,
                body: doc.body,
                link: doc.link
            }
        })
    )
);

module.exports = SubscriptionType;