import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const Footer: React.FunctionComponent = () => {
    
    const handleHomeClick = () => router.push("/home");

    return (
      <footer className="bg-stitched-black">

        <div className="flex justify-between items center px-10">
          <h1 className="text-white text-3xl">Subscribe for NewsLetter</h1>
          <div className="flex gap-4">
            <Input
                className="text-white w-52 rounded border border-pink-500 bg-transparent px-4 py-2 placeholder-pink-500 md:w-64 lg:w-96" 
                placeholder="Enter your email" 
            />
            <Button className="text-white bg-stitched-pink">subscribe</Button>
          </div>
        </div>

        <hr className="w-[95%] mx-auto mt-10"/>

        <div className="p-3"/>

        <div className="flex justify-between items-center px-10">

            <div className="p-4">
                <Avatar className="pb-2 mr-6 flex text-white cursor-pointer" onClick = {() => handleHomeClick()}>
                    <AvatarImage
                        className="w-[60px]"
                        src="/00.png"
                        alt="stitchedIT logo"
                    />
                    <span className="font-normal p-4 text-xl tracking-tight">
                    stitchedIT
                    </span>
                    <AvatarFallback>stitchedIT logo</AvatarFallback>
                </Avatar>
                <p className="text-white font-bold text-sm">We are growing your business with a personal AI manager</p>
            </div>

            <div className="flex gap-5 text-xs text-white p-4">
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

        <div className=" p-3"/>

        <div className="text-sm flex justify-between bg-stitched-pink text-white px-10 py-4">
          <p>2023 Maxwell Inc. All rights reserved</p>
          <ul className="flex gap-5">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookies</li>
          </ul>
        </div>

      </footer>
    );
}

export default Footer;