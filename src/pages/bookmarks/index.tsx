import Head from "next/head";
import { type NextPage } from "next";
import React from "react";

const PostPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Post Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            <h1>This is the Post page</h1>
        </>
    )
}

export default PostPage;