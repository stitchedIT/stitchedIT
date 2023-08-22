import Head from "next/head";
import { type NextPage } from "next";
import React from "react";
import Navbar from "~/components/NavBar";

const FeedPage: NextPage = () => {
    return (
      <>
        <Head>
          <title>Feed Page</title>
          <meta name="description" content="An app to explore new clothes." />
          <link rel="icon" href="/00.png" />
        </Head>
        <Navbar />
        <h1>This is the Feed page</h1>
      </>
    );
}

export default FeedPage;