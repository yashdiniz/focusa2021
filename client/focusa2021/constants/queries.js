import { gql } from '@apollo/client';

export const getProfileData = gql`
    query getProfileData($username: String!) {
        user(name: $username) {
            uuid,
            name,
            profile {
                userID, fullName, about,
                interests {
                    uuid, name, description
                }
            },
        }
    }
`;

export const searchCourses = gql`
    query searchCourses($query: String!) {
        results: courses(name: $query) {
            uuid, name, description
        }
    }
`;

export const searchPosts = gql`
    query searchPosts($query: String!, $offset: Int) {
        results: posts(q: $query, offset: $offset) {
            uuid, text, attachmentURL, time,
            parent {
                uuid
            },
            author {
                uuid, name
            },
            course {
                uuid, name
            }
        }
    }
`;

export const subscribeToCourse = gql`
    mutation subscribeToCourse($courseID: ID!) {
        subscribeToCourse(courseID: $courseID) {
            userID
        }
    }
`;

export const unsubscribeFromCourse = gql`
    mutation unsubscribeFromCourse($courseID: ID!) {
        unsubscribeFromCourse(courseID: $courseID) {
            userID
        }
    }
`;

export const getPostComments = gql`
    query getPostComments($postID: ID!, $offset: Int) {
        post(id: $postID) {
            uuid, text, attachmentURL, time,
            parent {
                uuid
            },
            author {
                uuid, name
            },
            course {
                uuid, name
            },
            comments(offset: $offset) {
                uuid, text, attachmentURL, time,
                parent {
                    uuid
                },
                author {
                    uuid, name
                },
                course {
                    uuid, name
                },
            }
        }
    }
`;

export const personalPosts = gql`
    query personalPosts($username: String!, $offset: Int) {
        user(name: $username) {
            uuid,
            posts(offset: $offset) {
                uuid, text, attachmentURL, time,
                parent {
                    uuid
                },
                author {
                    uuid, name
                },
                course {
                    uuid, name
                }
            }
        }
    }
`;

export const getCourseDetails = gql`
    query getCourseDetails($userID: ID!, $courseID: ID!, $offset: Int) {
        isSubscribed(userID: $userID, courseID: $courseID),
        course(id: $courseID) {
            uuid, name, description,
            posts(offset: $offset) {
                uuid, text, attachmentURL, time,
                parent {
                    uuid
                },
                author {
                    uuid, name
                },
                course {
                    uuid, name
                }
            }
        }
    }
`;

export const getUserRole =gql`
    query getUserRole($courseID: ID!, $username: String!){
        course(id: $courseID) {
            uuid,
            mods {
                uuid, name
            }
        },
        user(name: $username){
            uuid,
            roles{
                uuid,name
            }
        }
    }
`;

export const CreatePost = gql`
mutation CreatePost($courseID: ID!,$text: String!, $attachmentURL: String!){
    uuid,
}`