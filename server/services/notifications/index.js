const { PubSub } = require('../../libp2p-pubsub');

// const { addNotification } = require('./functions');

const server = true;
const notification = new PubSub(server);

/**
 * NOTE: The notifications service will be running 
 * on a separate microservice. Thus, database updates
 * here will not get monitored by graphql microservice.
 * 
 * Thus, we require graphql microservice to also be subscribed,
 * the same way this is. The value transferred to graphql service
 * will be directly unmarshalled and transmitted.
 */
// the server is subscribed to save to database.
notification.subscribe('postAdded', payload => {
    console.log(new Date(), 'notifications index:', payload.uuid, payload.time,
            payload.channel, payload.course,
            payload.body, payload.link);
    // addNotification(payload.uuid, payload.time,
    //     payload.channel, payload.course,
    //     payload.body, payload.link);
});