import { gql } from '@apollo/client';

export const getProfileData = gql`
    query getProfileData($username: String!) {
        user(name: $username) {
            uuid,
            name,
            profile{
                fullName, about
            }
        }
    }
`;

export const getCourses = gql`
    query getCourses($username: String!) {
        user(name: $username) {
            uuid,
            profile{
                userID,
                interests{
                    uuid, name, description
                }
            }
        }
    }
`;

export const getCourseDetails = gql`
    query getCourseDetails($userID: ID!, $courseID: ID!) {
        isSubscribed(userID: $userID, courseID: $courseID),
        course(id: $courseID) {
            uuid, name, description,
            posts {
                uuid, text, attachmentURL, time,
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