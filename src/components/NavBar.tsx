import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Navbar() {
  const staticStyles =
    "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white hover:cursor-pointer";
  const user = useUser();

  return (
    <nav className="sticky top-0 flex items-center justify-between p-6 bg-stitched-black">
      <div className="flex items-center">
        <Avatar className="mr-6 flex items-center text-white">
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
      <div className="flex gap-4">
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
          <UserButton />
          </>
        ) : (
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
