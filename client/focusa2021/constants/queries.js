import { gql } from '@apollo/client';

export const getProfileData = gql`
    query getProfileData($username: String!) {
        user(name: $username) {
            uuid,
            name,
            profile {
                userID, fullName, about
            }
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