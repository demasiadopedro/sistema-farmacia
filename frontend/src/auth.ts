import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        nome: { label: "Nome", type: "text" }
      },
      async authorize(credentials) {
        // Mock simples de autenticação como solicitado
        if (credentials?.email === "admin@admin.com" && credentials?.password === "admin") {
          return { id: "1", name: "Administrador", email: "admin@admin.com" }
        }

        // Aceita qualquer usuário para fins de simulação de cadastro/login
        if (credentials?.email && credentials?.password) {
          return {
            id: Math.random().toString(),
            name: (credentials?.nome as string) || "Usuário Teste",
            email: credentials.email as string
          }
        }

        // Retorna null caso as credenciais sejam inválidas
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-ignore
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})
