import { gql } from '@apollo/client';

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