import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Footer: React.FunctionComponent = () => {
  const handleHomeClick = () => router.push("/home");

  return (
    <footer className="bg-stitched-black">
      <div className="flex flex-col items-center justify-between px-6 py-4 md:flex-row md:px-10">
        <h1 className="mb-4 text-3xl text-white md:mb-0">
          Subscribe for Newsletter
        </h1>
        <div className="flex gap-4">
          <Input
            className="w-full rounded border border-pink-500 bg-transparent px-4 py-2 text-white placeholder-pink-500 md:w-64 lg:w-96"
            placeholder="Enter your email"
          />
          <Button className="bg-stitched-pink text-white">subscribe</Button>
        </div>
      </div>

      <hr className="mx-auto mt-10 w-[95%]" />

      <div className="flex flex-col items-center justify-between px-6 py-4 md:flex-row md:px-10">
        <div className="mb-4 md:mb-0">
          <Avatar
            className="mr-6 flex cursor-pointer pb-2 text-white"
            onClick={() => handleHomeClick()}
          >
            <AvatarImage
              className="w-[60px]"
              src="/00.png"
              alt="stitchedIT logo"
            />
            <span className="p-4 text-xl font-normal tracking-tight">
              stitchedIT
            </span>
            <AvatarFallback>stitchedIT logo</AvatarFallback>
          </Avatar>
          <p className="text-sm font-bold text-white">
            We are growing your business with a personal AI manager
          </p>
        </div>

        <div className="flex justify-between gap-5 p-5 text-xs text-white">
          <div>
            <h2 className="pb-2 text-sm">Platform</h2>
            <ul className="flex flex-col gap-1">
              <li>Plans & Pricing</li>
              <li>Personal AI Manager</li>
              <li>AI Business Writer</li>
            </ul>
          </div>
          <div>
            <h2 className="pb-2 text-sm">Company</h2>
            <ul className="flex flex-col gap-1">
              <li>Blog</li>
              <li>Careers</li>
              <li>News</li>
            </ul>
          </div>
          <div>
            <h2 className="pb-2 text-sm">Resources</h2>
            <ul className="flex flex-col gap-1">
              <li>Documentation</li>
              <li>Papers</li>
              <li>Press Conferences</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-stitched-pink px-6 py-4 text-sm text-white md:flex-row md:items-center md:justify-between md:px-10">
        <p className="mb-4 text-center md:mb-0">
        © 2023 stitchedIT All rights reserved
        </p>
        <ul className="flex justify-center gap-5">
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Cookies</li>
        </ul>
      </div>
    </footer>
  ); 
};

export default Footer;
