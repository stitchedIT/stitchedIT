import Head from "next/head";
import { type NextPage } from "next";
import React from "react";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import SwipeableComponent from "~/components/SwipeableComponent";
import { useUser } from "@clerk/nextjs";
type SwitchProps = {
    userId: string;
  }


export const getServerSideProps: GetServerSideProps<SwitchProps> = async (ctx:GetServerSidePropsContext) => {
    
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
    const { user } = useUser();
    console.log(user)

    // async function  getUser(){
    //     let dog = await api.user.getUserById.useQuery({
    //         id: userId.userId,
    //     })
    //     console.log(dog, "dog")
    // }
    // getUser()
   
    return (
        <>
            <Head>
                <title>Home Page</title>
                <meta name="description" content="An app to explore new clothes." />
                <link rel="icon" href="/00.png" />
            </Head>
            
            <SwipeableComponent userId={userId.userId}/>
        </>
    )
}

export default HomePage;