import Head from "next/head";
import Navbar from "~/components/NavBar";
import { type NextPage } from "next";
import React from "react";

const HomePage: NextPage = () => {
    return (
      <>
        <Head>
          <title>Home Page</title>
          <meta name="description" content="An app to explore new clothes." />
          <link rel="icon" href="/00.png" />
        </Head>
        <Navbar />
        <h1>This is the Home page</h1>
      </>
    );
}

export default HomePage;