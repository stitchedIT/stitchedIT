import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      console.log("Session callback initiated. Session:", session);
      console.log("User:", user);

      if (!user?.id) {
        console.error("User ID not present in session callback");
        throw new Error("User ID is required in session.");
      }

      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          id: user.id.toString(),
        },
      };

      console.log("Updated Session:", updatedSession);
      return updatedSession;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.error("Credentials not provided");
          throw new Error("Credentials not provided");
        }

        const inputUsername = credentials.username.trim();
        console.log(`Attempting authorization for user: ${inputUsername}`);

        const user = await prisma.user.findUnique({
          where: { userName: inputUsername },
        });

        if (!user) {
          console.error("No user found with this username:", inputUsername);
          throw new Error("No user found with this username.");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          console.error("Invalid password for user:", inputUsername);
          throw new Error("Invalid password.");
        }

        console.log("Authorization successful for user:", inputUsername);
        return user;
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: GetServerSidePropsContext) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
