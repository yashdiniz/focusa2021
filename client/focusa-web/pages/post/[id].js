import Head from "next/head";
import Layout from "../../components/Layout";
import Post from "../../components/Post";

export default function PostDetails({ uuid, title, description }) {
    return (
        <>
            <Head>
                <title>FOCUSA: Post Details View</title>
                {/* Reference: https://ogp.me/ */}
                <meta property="title" content={title} />
                <meta property="description" content={description} />
                <meta property="site_name" content="FOCUSA" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:site_name" content="FOCUSA" />
            </Head>
            <Layout>
                <span>Current post uuid passed: {uuid}</span>
                <Post
                    author='admin'
                    course='Random Dummy Data'
                    time={Date.now()}
                    text='Random dummy post at the moment.'
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
            title: 'Currently dummy.',
            description: 'Need to perform a graphql query to get the details from the server.',
        }
    };
}