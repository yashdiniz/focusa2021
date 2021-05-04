import { gql } from '@apollo/client';

const getPosts = gql`
    query getPosts($q: String, $offset: Int) {
        post(q:$q, offset:$offset){
            uuid, time, text, attachmentURL,
            author{ uuid, name },
            course{ uuid, name },
        }
    }
`;

export { getPosts };