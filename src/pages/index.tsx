import Head from "next/head";
import { type NextPage } from "next";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Landing Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <main className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-stitched-black p-5 md:px-20 font-sans">
        <div className="flex flex-col items-start space-y-6 md:space-y-8 md:mr-16">
          <h1 className="text-4xl md:text-6xl font-bold text-stitched-pink">
            Discover a world of fashion inspiration.
          </h1>
          <p className="text-lg md:text-2xl text-white">
            Unleash your inner fashionista. Every piece in our collection is a canvas for your unique style.
          </p>
          <Link className="inline-flex items-center justify-center text-lg md:text-xl px-6 py-3 leading-none border rounded text-white border-stitched-pink hover:border-transparent hover:text-stitched-pink hover:bg-white cursor-pointer transition duration-300 ease-in-out" href="/home">
              Get Started
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
          </Link>
        </div>
        <div className="w-full md:w-1/2">
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
    </>
  );
};

export default HomePage;




