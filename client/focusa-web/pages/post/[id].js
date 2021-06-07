import { useQuery } from "@apollo/client";
import Head from "next/head";
import Layout from "../../components/Layout";
import MetaTags from "../../components/Meta";
import Post from "../../components/Post";
import LoadingIndicator from "../../components/LoadingIndicator";
import { getPostComments } from "../../constants/queries";
import { connectProps } from '../../hooks/store';
import LoginErrorIndicator from "../../components/LoginErrorIndicator";

function PostDetails({ uuid: postID, token }) {
    const { data, loading, error } = useQuery(getPostComments, {
        variables: {
            postID,
            offset: 0
        }
    });

    if(token.length < 20) return <LoginErrorIndicator/>;

    if(loading) return <LoadingIndicator />;

    if(error) console.error('PostDetails', error);

    return (
        <>
            <Head>
                <title>FOCUSA: Post Details View</title>
                <MetaTags
                    title="Post on FOCUSA"
                    description="Discuss and learn on FOCUSA! Welcome to the community!"
                />
            </Head>
            <Layout>
                Data received: {JSON.stringify(data)}
                {/* <Post
                    key={uuid}
                    author='admin'
                    course='Random Dummy Course name'
                    time={Date.now()}
                    text='Random dummy post text at the moment.'
                /> */}
            </Layout>
        </>
    );
}

export default connectProps(PostDetails);

export async function getServerSideProps(context) {
    // Reference: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
        props: {
            uuid: context.params.id,
        }
    };
}