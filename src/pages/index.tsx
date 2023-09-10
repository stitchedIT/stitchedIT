import Head from "next/head";
import { type NextPage } from "next";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { type GetServerSideProps } from "next";

import Footer from "~/components/Footer";  
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Components
import Navbar from "~/components/NavBar";
import SwipeableComponent from "~/components/SwipeableComponent";

type SwitchProps = {
  userId: string;
};
export const getServerSideProps: GetServerSideProps<SwitchProps> = async (
  ctx: GetServerSidePropsContext
) => {
  // const { userId } = getAuth(ctx.req);
  const { userId } = getAuth(ctx.req);
  // if (!userId) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

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
      <main className="md:px-50 flex min-h-screen flex-col items-center justify-center bg-stitched-black p-8 md:flex-row">
        <div className="flex flex-col items-start space-y-4 md:space-y-8">
          {/* Adjusted text size for smaller screens */}
          <h1 className="text-4xl font-bold text-stitched-pink sm:text-5xl md:text-4xl lg:text-6xl">
            Discover a world of fashion inspiration.
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
          <div className="flex flex-col items-center gap-2">
            <Image width={250} height={250} src={`/00.png`} alt="stitchedIT" />
            
          </div>
          <p className="text-lg md:text-2xl text-white">
            Unleash your inner fashionista. Every piece in our collection is a canvas for your unique style.
          </p>
          <Link
            className="inline-flex cursor-pointer items-center justify-center rounded border border-stitched-pink px-4 py-2 text-base leading-none text-white transition duration-300 ease-in-out hover:border-transparent hover:bg-white hover:text-stitched-pink md:px-6 md:py-3 md:text-lg lg:text-xl"
            href="/home"
          >
            Get Started
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 md:ml-3"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
        <div className="hidden w-full md:block lg:w-1/2">
          <Image
            src="/images/landing-page-img.png"
            alt="landing-page-image"
            layout="responsive"
            width={700}
            height={490}
            className="rounded-lg shadow-xl"
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
