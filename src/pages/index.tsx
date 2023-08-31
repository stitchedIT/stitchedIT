// NextJS utils
import Head from "next/head";
import Image from "next/image";
import { type NextPage } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { type GetServerSideProps } from "next";
// Components
import Navbar from "~/components/NavBar";
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
        <title>Landing Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">stitchedIT</span>
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          <div className="flex flex-col items-center gap-2">
            <Image width={250} height={250} src={`/00.png`} alt="stitchedIT" />
            <SwipeableComponent userId={userId}/>
          </div>
        </div>
      </main>
    </>
  );
}



export default HomePage;