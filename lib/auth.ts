import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import db from "./db";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface Session {
      user: {
          id: string;
          email: string;
          name: string;
          image: string;
      };
  }
}
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30*24*60*60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }

        const verfied = await compare(
          credentials.password,
          user?.password as string
        );
        if (!verfied) {
          return null;
        }
        return {
          id: `${user.id}`,
          name: user.name,
          email: user.email,
          image: user?.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user:profile, account }) {
      if (account?.provider === "google") {
        const user = await db.user.findUnique({
          where: {
            email: profile?.email as string,
          },
        });
        if (!user) {
          const newUser=await db.user.create({
            data: {
              name: profile?.name,
              email: profile?.email,
              image: profile?.image ,
            },
          });
        }
        if(!user?.image){
          await db.user.update({
            where: {
              email: profile?.email as string,
            },
            data: {
              image: profile?.image,
            },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const user = await db.user.findUnique({
          where: {
            email: token.email as string,
          },
        });
        return {
          ...session,
          user: {
            ...session.user,
            id:user?.id,
            name: token.name,
          },
        };
      }
      return session;
    },
  },
};
