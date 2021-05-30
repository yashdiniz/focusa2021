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

export const getCourses = gql`
    query getCourses($username: String!) {
        user(name: $username) {
            uuid,
            profile {
                userID,
                interests {
                    uuid, name, description
                }
            }
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