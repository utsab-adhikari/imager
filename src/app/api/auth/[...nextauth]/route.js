import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import connectDB from '@/db/ConnectDB';
import User from "@/models/userModel";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
   pages: {
  signIn: '/auth/login',
},
  callbacks: {
    async session({ session }) {
      await connectDB();
     if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString(); 
          session.user.name = user.name;
          session.user.image = user.image;
          session.user.role = user.role;
          session.user.family = user.family;
        }
      }
      return session;
    },
    async signIn({ user }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: 'user',
        });
      }
      return true;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
