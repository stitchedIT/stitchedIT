import Head from "next/head";
import { NextPage } from "next";
import React from "react";

const Signup: NextPage = () => {
    return (
        <>
            <Head>
                <title>Signup Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            <h1>This is the Signup page</h1>
        </>
    )
}

export default Signup;