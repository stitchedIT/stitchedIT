import Head from "next/head";
import { type NextPage } from "next";
import React from "react";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import SwipeableComponent from "~/components/SwipeableComponent";
type SwitchProps = {
    userId: string;
  }

export const getServerSideProps: GetServerSideProps<SwitchProps> = async (ctx:GetServerSidePropsContext) => {
    // const { userId } = getAuth(ctx.req);
    const { userId } = getAuth(ctx.req);
    if (!userId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false, 
        },
      };
    }
    
    return { props: { ...buildClerkProps(ctx.req), userId } };
  };
const HomePage: NextPage = (userId: any) => {
    return (
        <>
            <Head>
                <title>Home Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            <h1>This is the Home page</h1>
            <SwipeableComponent userId={userId.userId}/>
        </>
    )
}

export default HomePage;