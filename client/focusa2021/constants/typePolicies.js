/**
 * This file contains the typePolicies used by Apollo client
 * to help simiplify caching efforts.
 * author: @yashdiniz;
 * 
 * Reference: https://www.apollographql.com/docs/react/pagination/core-api/#merging-paginated-results
 */
export default {
    Query: {
        fields: {
            // token: {},
            // role: {},
            // profile: {},
            // isSubscribed: {},
            // courses: {},
            // user: {
            //     keyArgs: ['id', 'name'],                
            // },
            // post: {
            //     keyArgs: ['id'],
            // },
            // course: {
            //     keyArgs: ['id'],
            // },
            posts: {
                keyArgs: false,
                merge(existing, incoming, { args: { offset = 0 } }) {
                    // Slicing is necessary because the existing data is immutable, and frozen in development.
                    const merged = existing ? existing.slice(0) : [];

                    for (let i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }

                    // const mergedUnique = merged.reduce((a, val) => {
                    //     if (a.map(i => i?.uuid).includes(val?.uuid)) return a;
                    //     else return [ ...a, val ];
                    // }, []);
                    return merged;
                },
            },
        }
    },
    User: {
        keyFields: ['uuid'],
        fields: {
            // name: {},
            // profile: {},
            // roles: {},
            posts: {
                keyArgs: false,
                merge(existing, incoming, { args: { offset = 0 } }) {
                    // Slicing is necessary because the existing data is immutable, and frozen in development.
                    const merged = existing ? existing.slice(0) : [];

                    for (let i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }

                    // const mergedUnique = merged.reduce((a, val) => {
                    //     if (a.map(i => i?.uuid).includes(val?.uuid)) return a;
                    //     else return [ ...a, val ];
                    // }, []);
                    return merged;
                },
            },
        }
    },
    Profile: {
        keyFields: ['userID'],
        fields: {
            // about: {},
            // display_pic: {},
            // fullName: {},
            // user: {},
            // interests: {},
        }
    },
    Course: {
        keyFields: ['uuid'],
        fields: {
            // name: {},
            // mods: {},
            // description: {},
            subscribers: {
                keyArgs: false,
                merge(existing, incoming, { args: { offset = 0 } }) {
                    // Slicing is necessary because the existing data is immutable, and frozen in development.
                    const merged = existing ? existing.slice(0) : [];
                    for (let i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }
                    return merged;
                },
            },
            posts: {
                keyArgs: false,
                merge(existing, incoming, { args: { offset = 0 } }) {
                    // Slicing is necessary because the existing data is immutable, and frozen in development.
                    const merged = existing ? existing.slice(0) : [];

                    for (let i = 0; i < incoming.length; ++i) {
                        merged[offset + i] = incoming[i];
                    }

                    // const mergedUnique = merged.reduce((a, val) => {
                    //     if (a.map(i => i?.uuid).includes(val?.uuid)) return a;
                    //     else return [ ...a, val ];
                    // }, []);
                    return merged;
                },
            },
        }
    },
    Role: {
        keyFields: ['uuid'],
        fields: {
            // name: {},
            // users: {},
        }
    },
    Post: {
        keyFields: ['uuid'],
        fields: {
            // time: {},
            // text: {},
            // author: {},
            // parent: {},
            // attachmentURL: {},
            // course: {},
            // comments: {},
            // reported: {},
            // approved: {},
        }
    },
};