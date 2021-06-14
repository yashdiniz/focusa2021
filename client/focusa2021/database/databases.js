import { useEffect, useState } from 'react';
import { createRxDatabase, addRxPlugin, RxDocument } from 'rxdb';

import HTTPPouch from 'pouchdb-adapter-http';
import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

import './polyfills';   // executing polyfills to base64 functions

// add the adapters required by RxDB to use SQLite.
addRxPlugin(SQLiteAdapterFactory(SQLite));

const postsSchema = {
    name: 'posts',
    title: 'FOCUSA posts schema',
    version: 0,
    description: "Contains the posts published by authors, belonging to a course, and flagged using other attributes.",
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
            primary: true,
        },
        text: {
            type: 'string',
        },
        course: {
            type: 'string',
            final: true,
        },
        author: {
            type: 'string',
            final: true,
        },
        time: {
            type: 'number', // save timestamp
        },
        attachmentURL: {
            type: 'string',
            final: true,
        },
    },
    required: ['text', 'time', 'author'],
    indexes: ['course', 'author'],
};

export const focusa = createRxDatabase({
    name: 'focusa',
    adapter: 'react-native-sqlite' // the name of the adapter
})
    .then(database => database.addCollections({
        posts: { schema: postsSchema },
    }))
    .catch(e => console.error(new Date(), 'Client Database Error', e));

/**
 * Passes a document fetched from the database as props to a component.
 * ```
 *  const data = documentToState();
 * ```
 * @param {Promise<RxDocument>[]} documents Documents to pass as state.
 */
export const documentToState = (documents) => {
    const [data, setData] = useState([]);
    // converting document data to a State to pass down.
    useEffect(() => {
        for (let document in (await Promise.all(documents)))
            setData([...data, document.toJSON()]);
    });

    return data;
}