import { gql } from '@apollo/client';

export const getProfileData = gql`
    query getProfileData($username: ID!) {
        user(name: $username) {
            name,
            profile{
                fullName, about
            }
        }
    }
`;