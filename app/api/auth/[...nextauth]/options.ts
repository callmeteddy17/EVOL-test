import client from '@/prisma/prismadb';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(client),
  providers: [
    CredentialProvider({
      id: 'credentials',
      name: 'credential',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credential, req) {
        // console.log(credential);
        if (!credential?.email || !credential?.password) {
          return null;
        }
        const user = await prisma?.user.findUnique({
          where: {
            email: credential.email,
          },
        });
        if (!user) {
          return null;
        }
        const password = await bcrypt.compare(
          credential.password,
          user.password!
        );
        console.log(password);
        if (!password) {
          return null;
        }
        console.log(user);
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name}${profile.family_name}`,
          email: profile.name,
          image: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, session, user, profile }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ token, session, user }) {
      return {
        ...session,
        user: { ...session.user, id: token.id },
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};
