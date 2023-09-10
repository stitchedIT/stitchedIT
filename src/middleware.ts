import { authMiddleware } from "@clerk/nextjs";

const afterSignOutCallback = ({ clerk }) => {
  // Redirect to your landing page after signout
  clerk.signOut().then(() => {
    window.location.href = "/";
  });
};

export default authMiddleware({
  publicRoutes: ["/", "/api/clerk/createUser"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
