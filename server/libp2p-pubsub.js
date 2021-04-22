/**
 * This file contains the libp2p node instantiator.
 * author: yashdiniz;
 */
const libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const { NOISE } = require('libp2p-noise');
const MPLEX = require('libp2p-mplex');
const dht = require('libp2p-kad-dht');
const pubsub = require('libp2p-gossipsub');
const { libp2pRealm } = require('./config');

// compiling a protobuf instance for marshalling the data.
const { Notification } = require('protons')(`
message Notification {
    required string uuid = 1;
    required string time = 2;
    required string channel = 3;
    optional string course = 4;
    required string body = 5;
    required string link = 6;
}`);

let config = {
    modules: {
        transport: [TCP],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX],
        dht,
        pubsub,
    },
    connectionManager: {
        maxConnections: Infinity,
        minConnections: 0,
    },
    config: {
        pubsub: {   // The pubsub options (and defaults) can be found in the pubsub router documentation
            enabled: true,
            emitSelf: true,    // whether the node should emit to self on publish
        },
        dht: {      // The DHT options (and defaults) can be found in its documentation
            kBucketSize: 20,
            enabled: true,
            randomWalk: {
                enabled: true,  // Allows to disable discovery (enabled by default)
                interval: 300e3,
                timeout: 10e3
            }
        }
    }
};

class PubSub {
    node = {};
    async create(isServer = false) {
        if (isServer) { // if not pinging, then listen...
            config.addresses = {
                // add a listen address (localhost) to accept TCP connections on a random port
                listen: [ libp2pRealm ]
            };
        }
        this.node = await libp2p.create(config);

        await this.node.start(); // start libp2p node
        node.multiaddrs.forEach(addr => 
            console.log(`libp2p-pubsub listening at ${addr.toString()}/p2p/${node.peerId.toB58String()}`)
        );

        if (!isServer) {
            console.log(`Pinging libp2p-pubsub at ${libp2pRealm}`);
            const latency = await this.node.ping(libp2pRealm);
            console.log(`Pinged ${libp2pRealm} in ${latency}ms`);
        }
        
        this.node.connectionManager.on('peer:connect',
            connection => console.log('Connected to %s', connection.remotePeer.toB58String()));
    
        const stop = async () => {
            // stop libp2p node
            await this.node.stop();
            process.exit(0);
        }
    
        // always stop the socket before terminating process
        process.on('SIGTERM', stop);
        process.on('SIGINT', stop);
    }

    /**
     * Publishes a marshalled notification to whoever is subscribed.
     * @param {string} uuid The UUID of the notification to publish.
     * @param {string} channel The channel(topic) on which the notification is being published.
     * @param {string} course (optional) The course ID to be attached to this notification.
     * @param {string} body The notification body.
     * @param {string} link The notification link(URL).
     */
    publish(uuid, channel, course, body, link) {
        this.node.pubsub.publish(channel, Notification.encode({
            uuid, time: Date.now(), channel, course, body, link,
        }))
    }

    /**
     * Subscribes to a notification channel, and returns an unmarshalled payload to callback.
     * @param {string} channel The channel(topic) to subscribe to.
     * @param {function} callback Callback function to be invoked on any new pubsub payload.
     */
    subscribe(channel, callback) {
        this.node.pubsub.subscribe(channel, message =>{
            let payload = Notification.decode(message.data);
            callback(payload, message); // also returning unmarshalled message contents, to check signature.
        });
    }
}

module.exports = { PubSub }