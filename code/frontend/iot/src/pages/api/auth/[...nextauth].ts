import apis from '@/apis'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'login',
      id: 'login',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        // Add logic to validate credentials and return a user object
        // You can also fetch user data from your API here
        const data = await apis.login(
          credentials?.username ?? '',
          credentials?.password ?? '',
        )
        if (data?.token) return null

        const user = JSON.parse(data)
        return {
          id: user.userId,
          name: user.username,
          jwt: user.token,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // user is only available the first time a user signs in authorized
      if (user) {
        return {
          ...token,
          jwt: user.jwt,
          id: user.id,
        }
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) {
        session.jwt = token.jwt
        session.id = token.id
      }
      return session
    },
  },
})
