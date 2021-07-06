import { documentLimit } from '../config';
import { db } from './databases';
import { ToastAndroid } from 'react-native';
import { useState } from 'react';

// Reference: https://aboutreact.com/react-native-offline-app-using-pouchdb-couchdb/

db.createIndex({
    index: {
        fields: ['time']
    }
}).catch(console.error);

/**
 * Save a post to the PouchDB database.
 * @param {string} uuid 
 * @param {string} text 
 * @param {string} course 
 * @param {string} author 
 * @param {number} time 
 * @param {string} attachmentURL 
 * @returns {null}
 */
export function savePost(uuid, text, course, author, time, attachmentURL) {
    ToastAndroid.showWithGravityAndOffset(
        "Saving post offline...",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    );
    return db.put({
        _id: uuid,
        text, time, attachmentURL,
        course: course.name,
        author: author.name,
    }).catch(console.error);
}

/**
 * Return all posts from the database.
 * @returns {Promise}
 */
export function getAllPosts() {
    const [posts, setPosts] = useState([]);
    db.find({
        selector: {
            time: { $gte: null }
        },
        sort: [{ time: 'desc' }],
    })
        .then((docs) => {
            setPosts(docs)
            console.log(new Date(), 'getAllPosts', docs);
        })
        .catch(console.error);

    return posts;
}

/**
 * Get the post stored offline with matching UUID.
 * @param {string} uuid The UUID of the post to receive.
 * @returns {Promise}
 */
export function getPost(uuid) {
    return db.get(uuid).catch(console.error);
}