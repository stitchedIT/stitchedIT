import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import {Button} from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Router from "next/router";

function Navbar() {
  const staticStyles =
    "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-[#2e026d] hover:bg-white hover:cursor-pointer";
  const user = useUser();
  const router = Router;

  const handleFeedButton = () => {
    router.push("/feed");
  }
  const handleBookmarkButton = () => {
    router.push("/bookmarks");
  }

  return (
    <nav className="sticky top-0 flex items-center justify-between bg-transparent p-6">
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
            <Button className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`} onClick={() => handleFeedButton()}> Feed</Button>
            <Button className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`} onClick={() => handleBookmarkButton()}> Bookmarks</Button>
            <SignOutButton>
              <span
                className={`${staticStyles} ${buttonVariants({
                  variant: "outline",
                })}`}>
                Logout
              </span>
            </SignOutButton>
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