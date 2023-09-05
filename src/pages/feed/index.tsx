import Head from "next/head";
import { NextPage, GetServerSideProps } from "next";
import React from "react";
import CreatePost from "~/components/CreatePost";
import PostList from "~/components/PostList";
import { api } from "~/utils/api";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { Post } from "~/types";

type Props = {
  userId: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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

const FeedPage: NextPage<Props> = ({ userId }) => {
  return (
    <>
      <Head>
        <title>Feed Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <div className="bg-stitched-darkGray p-5 md:px-20">
      <CreatePost userId={userId} />
      
      <PostList userId={userId} />
      </div>
    </>
  );
};

export default FeedPage;
