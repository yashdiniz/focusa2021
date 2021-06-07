import Head from "next/head";
import Layout from "../../components/Layout";
import MetaTags from "../../components/Meta";
import Post from "../../components/Post";

export default function PostDetails({ uuid }) {
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
                <span>Current post uuid passed: {uuid}</span>
                <Post
                    key={uuid}
                    author='admin'
                    course='Random Dummy Course name'
                    time={Date.now()}
                    text='Random dummy post text at the moment.'
                />
            </Layout>
        </>
    );
}

export async function getServerSideProps(context) {
    // Reference: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
        props: {
            uuid: context.params.id,
        }
    };
}