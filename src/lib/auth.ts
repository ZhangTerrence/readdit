import { randomUsername } from "./usernames";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token, user }) {
      const databaseUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!databaseUser) {
        token.id = user!.id;
        return token;
      }

      if (!databaseUser.username) {
        await prisma.user.update({
          where: {
            id: databaseUser.id,
          },
          data: {
            username: randomUsername,
          },
        });
      }

      return {
        id: databaseUser.id,
        username: databaseUser.username,
        name: databaseUser.name,
        email: databaseUser.email,
        picture: databaseUser.image,
      };
    },

    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

export default authOptions;
