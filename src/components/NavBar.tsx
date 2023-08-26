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

/**
 * Renders the navigation bar component.
 * @returns {JSX.Element} The rendered navigation bar.
 */
function Navbar() {
  // Define static styles for buttons
  const staticStyles =
    "inline-flex items-center justify-center text-sm px-4 py-2 leading-none border rounded  text-stitched-pink border-stitched-pink hover:border-transparent hover:text-stitched-pink hover:bg-white hover:cursor-pointer";
  
  // Get the user information
  const user = useUser();
  const router = useRouter();
  const handleHomeClick = () => {
    router.push("/home");
  }
  return (
    <nav className="sticky top-0 flex items-center justify-between bg-stitched-black p-6">
      {/* Logo */}
      <div className="flex items-center">
        <Avatar className="mr-6 flex items-center text-stitched-pink cursor-pointer">
          <AvatarImage
            onClick = {() => handleHomeClick()}
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

      {/* Search bar in center for /feed */}
      {user.isSignedIn && router.pathname === "/feed" && (
        <Input
          className="text-white w-52 rounded border border-pink-500 bg-transparent px-4 py-2 placeholder-pink-500 md:w-64 lg:w-96"
          placeholder="Search"
        />
      )}

      {/* Buttons on the right */}
      <div className="flex gap-4">
        {user.isSignedIn ? (
          // Render buttons for signed-in users
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
            <UserButton />
          </>
        ) : (
          // Render buttons for non-signed-in users
          <>
            <SignInButton>
              <span
                className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Login
              </span>
            </SignInButton>
            <SignUpButton>
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