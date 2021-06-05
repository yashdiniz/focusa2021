import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import Post from "../../components/Post";

export default function PostDetails({ uuid }) {
    return (
        <Layout>
            <span>Current post uuid passed: {uuid}</span>
            <Post 
                author='admin'
                course='Random Dummy Data'
                time={Date.now()}
                text='Random dummy post at the moment.'
            />
        </Layout>
    );
}

export async function getServerSideProps(context) {
    // Reference: https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
        props: {
            uuid: context.params.id,
        }
    }
}