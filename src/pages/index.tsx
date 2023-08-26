import Head from "next/head";
import { type NextPage } from "next";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const HomePage: NextPage = () => {
  const staticStyles =
    "inline-flex items-center justify-center text-sm px-4 py-2 leading-none border rounded text-white border-stitched-pink hover:border-transparent hover:text-stitched-pink hover:bg-white hover:cursor-pointer";
  return (
    <>
      <Head>
        <title>Landing Page</title>
        <meta name="description" content="An app to explore new clothes." />
        <link rel="icon" href="/00.png" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-stitched-black px-11">
        <div className="flex flex-col items-start">
          <div style={{ display: "inline-block" }}>
            <h1 className="text-5xl font-bold text-stitched-pink">
              Discover a world of fashion inspiration with our curated clothing.
            </h1>
            <div className="p-3" />
            <p className="text-xl text-white">
              Unleash your inner fashionista and embark on a journey through our
              meticulously curated clothing collection, where every piece is a
              canvas for your unique style expression.
            </p>
            <div className="p-3" />
            <Link
              href="/home"
              className={`${staticStyles} ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Get Started
            </Link>
          </div>
        </div>
        <Image
          src="/00.png"
          alt="landing-page-image"
          width={350}
          height={350}
        />
      </main>
    </>
  );
};

export default HomePage;
