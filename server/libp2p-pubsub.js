/**
 * This file contains the libp2p node instantiator.
 * author: yashdiniz;
 */
const libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
const Websockets = require('libp2p-websockets');
const { NOISE } = require('libp2p-noise');
const MPLEX = require('libp2p-mplex');
const dht = require('libp2p-kad-dht');
const pubsub = require('libp2p-gossipsub');
const { libp2pRealm, serviceAuthPass, JWTsignOptions, authRealm } = require('./config');

const {create} = require('axios');
let token = '';
const auth = create({
    baseURL: `${authRealm}`,
    timeout: 5000,
});

let loginDetails = Buffer.from(`pubsub:${serviceAuthPass}`).toString('base64');
auth.get('/', {
    headers: {authorization: `Basic ${loginDetails}`}
    }).then(res => token = res.data.token);
setInterval(() => auth.get('/', {
headers: {authorization:`Basic ${loginDetails}`}
})
.then(res => token = res.data.token), (JWTsignOptions.expiresIn-10)*1000);

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
let addrs= [];  // the singleton data structure holding all the addresses...

function waitForAddrs(condition) {
    const poll = resolve => {
        if (condition()) resolve(addrs);
        else setTimeout(_ => poll(resolve), 500);
    }
    return new Promise(poll);
}
waitForAddrs(() => (addrs.length > 0 && token.length > 0))
.then(async () => await auth.get('/AddPubSubpeerIds', {
    params: { addrs },
    headers: { authorization: token },
}).catch(e => {
    console.error(Date.now(), 'Failed to update PubSub peer ID.');
    console.error(e);
}))
class PubSub {
    node;
    constructor(isServer = false) {
        let config = {
            modules: {
                transport: [TCP, Websockets],
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
        if (isServer) { // if is server, then listen...
            config.addresses = {
                // add a listen address (localhost) to accept TCP connections on a random port
                listen: [libp2pRealm]
            };
        }
        this.node = libp2p.create(config);
        this.create(isServer);
    }

    async create(isServer = false) {
        let node = await this.node;
        
        await node.start(); // start libp2p node
        addrs = node.multiaddrs.map(addr => `${addr.toString()}/p2p/${node.peerId.toB58String()}`)

        // Share peerIds to auth server, so that it can be downloaded.
        if(isServer) {
            console.log(Date.now(), `libp2p-pubsub listening at ${addrs}`);
        } else {    // if not server, then ping to establish connection...
            await waitForAddrs(() => (token.length > 0))
            .then(async () => {
                await auth.get('/PubSubpeerIds', {
                    headers: { authorization: token },
                }).then(async res => {
                    await Promise.all(res.data.addrs.map(o => node.ping(o)));
                });
            })
        }

        node.connectionManager.on('peer:connect',
            connection => console.log(Date.now(), `Connected to`, connection.remotePeer.toB58String()));

        const stop = async () => {
            // stop libp2p node
            await node.stop();
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
    async publish(uuid, channel, course, body, link) {
        const node = await this.node;
        setTimeout(()=> 
        node.pubsub.publish(channel, Notification.encode({
            uuid, time: Date.now(), channel, course, body, link,
        })), 1000);
    }

    /**
     * Subscribes to a notification channel, and returns an unmarshalled payload to callback.
     * @param {string} channel The channel(topic) to subscribe to.
     * @param {function} callback Callback function to be invoked on any new pubsub payload.
     */
    async subscribe(channel, callback) {
        const node = await this.node;
        setTimeout(() =>
        node.pubsub.subscribe(channel, message => {
            let payload = Notification.decode(message.data);
            callback(payload, message); // also returning unmarshalled message contents, to check signature.
        }), 1000);
    }

    /**
     * Unsubscribe from a notification channel.
     * @param {string} channel The channel(topic) to unsubscribe from.
     */
    async unsubscribe(channel) {
        const node = await this.node;
        node.pubsub.unsubscribe(channel);
    }
}

module.exports = { PubSub }