import { documentLimit } from '../config';
import { focusa } from './databases';
import { RxDocument } from 'rxdb';

/**
 * Accepts a batch of posts to insert into the database.
 * 
 */
export async function savePosts(batch) {
    for(let post in batch) {
        const { uuid, text, course, author, time, attachmentURL } = post;
        const c = await focusa;
        return await c.posts.insert({
            uuid, parent, text, 
            course: course.name, author: author.name,
            time, attachmentURL
        });
    }
}

/**
 * All posts from the database will be sent with limits.
 * @param {number} offset The offset from which to send more posts.
 * @returns {Promise<RxDocument>}
 */
export async function getAllPosts(offset) {
    let c = await focusa;
    return await c.posts.find().exec()
    .limit(documentLimit).skip(offset)
    .then(doc => {
        if(doc) return doc;
    });
}