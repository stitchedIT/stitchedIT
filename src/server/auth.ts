import { type GetServerSidePropsContext } from "next";
import { type DefaultSession } from "next-auth";
import { getAuth, SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/server';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      clerkUserId: string; // Clerk user ID
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      console.log("Session callback initiated. Session:", session);
      console.log("User:", user);

      if (!user?.clerkUserId) {
        console.error("Clerk user ID not present in session callback");
        throw new Error("Clerk user ID is required in session.");
      }

      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          clerkUserId: user.clerkUserId,
        },
      };

      console.log("Updated Session:", updatedSession);
      return updatedSession;
    },
  },
};

export const getServerAuthSession = (ctx: GetServerSidePropsContext) => {
  const auth = getAuth(ctx.req);
  return auth;
};
