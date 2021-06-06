import Head from "next/head";

export default function MetaTags({ title, description }) {
    return (
        <Head>
            {/* Reference: https://ogp.me/ */}
            <meta property="title" content={title} />
            <meta property="og:title" content={title} />

            <meta property="description" content={description} />
            <meta property="og:description" content={description} />
            
            <meta property="site_name" content="FOCUSA" />
            <meta property="og:site_name" content="FOCUSA" />
        </Head>
    );
}