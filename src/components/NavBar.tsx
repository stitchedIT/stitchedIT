import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/router';
import { useState } from "react";

/**
 * Renders the navigation bar component.
 * @returns {JSX.Element} The rendered navigation bar.
 */
function Navbar() {
  // State to control the visibility of the side menu
  const [isMenuVisible, setMenuVisible] = useState(false);


  // Function to toggle the side menu visibility
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Define static styles for buttons
  const staticStyles =
    "inline-flex items-center justify-center text-sm px-4 py-2 leading-none border rounded  text-stitched-pink border-stitched-pink hover:border-transparent hover:text-stitched-pink hover:bg-white hover:cursor-pointer";

  // Get the user information
  const user = useUser();
  const router = useRouter();
  const handleLandingClick = () => {
    router.push("/");
  };
  return (
    <nav className="sticky top-0 flex items-center justify-between bg-stitched-black p-6">
      <div className="flex items-center">
        {/* Hamburger Button for mobile view */}
        <button
          className="mr-6 text-3xl text-white lg:hidden"
          onClick={toggleMenu}
        >
          &#9776;
        </button>

        {/* Logo */}
        <Avatar
          className="mr-6 flex cursor-pointer items-center text-stitched-pink"
          onClick={handleLandingClick}
        >
          <AvatarImage
            className="w-[60px]"
            src="/00.png"
            alt="stitchedIT logo"
          />
          <span className="p-4 text-xl font-semibold tracking-tight">
            stitchedIT
          </span>
          <AvatarFallback>stitchedIT logo</AvatarFallback>
        </Avatar>
      </div>

      {/* Search bar for /feed */}
      {/* {user.isSignedIn && router.pathname === "/feed" && (
        <Input
          className="w-52 rounded border border-pink-500 bg-transparent px-4 py-2 text-white placeholder-pink-500 md:w-64 lg:w-96"
          placeholder="Search"
        />
      )} */}

      {/* Side Menu for Mobile */}
      <div
        className={`fixed left-0 top-0 h-full w-[40%] transform bg-stitched-black bg-opacity-80 text-white backdrop-blur-[15px]
 transition-transform duration-300 ${
          isMenuVisible ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <button
          className="absolute right-4 top-4 text-2xl"
          onClick={toggleMenu}
        >
          &#10005;
        </button>
        <div className="flex h-full flex-col items-center justify-center space-y-4">
          {user.isSignedIn ? (
            <>
              <Link href="/home" onClick={toggleMenu}>
                Home
              </Link>
              <Link href="/feed" onClick={toggleMenu}>
                Feed
              </Link>
              <Link href="/bookmarks" onClick={toggleMenu}>
                Bookmarks
              </Link>
              {/* If UserButton causes a navigation change, you might also want to toggle the menu there. */}
              <UserButton onClick={toggleMenu} />
            </>
          ) : (
            <>
              <SignInButton onClick={toggleMenu}>Login</SignInButton>
              <SignUpButton onClick={toggleMenu}>Sign Up</SignUpButton>
            </>
          )}
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden gap-4 lg:flex">
        {user.isSignedIn ? (
          <>
            <Link
              href="/home"
              className={`${staticStyles} ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Home
            </Link>
            <Link
              href="/feed"
              className={`${staticStyles} ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Feed
            </Link>
            <Link
              href="/bookmarks"
              className={`${staticStyles} ${buttonVariants({
                variant: "outline",
              })}`}
            >
              Bookmarks
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton afterSignInUrl = "/home">
              <span
                className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Login
              </span>
            </SignInButton>
            <SignUpButton afterSignUpUrl= "/form">
              <span
                className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Sign Up
              </span>
            </SignUpButton>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;