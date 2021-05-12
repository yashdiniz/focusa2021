import { gql } from '@apollo/client';

export const getProfileData = gql`
    query getProfileData($username: String!) {
        user(name: $username) {
            name,
            profile{
                fullName
            }
        }
    }
`;