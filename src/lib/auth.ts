import { AuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { nanoid } from "nanoid";

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
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
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
            username: nanoid(10),
          },
        });
      }

      return {
        id: databaseUser.id,
        name: databaseUser.name,
        email: databaseUser.email,
        picture: databaseUser.image,
        username: databaseUser.username,
      };
    },

    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

export default authOptions;
