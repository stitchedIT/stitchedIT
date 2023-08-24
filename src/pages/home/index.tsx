import Head from "next/head";
import SwipeableComponent from "~/components/SwipeableComponent";
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
      <SwipeableComponent />
    </>
  );
};

export default HomePage;
