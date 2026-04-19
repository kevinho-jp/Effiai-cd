import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        if (credentials.email !== process.env.ADMIN_EMAIL) return null
        
        let admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        })
        
        if (!admin) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          admin = await prisma.admin.create({
            data: {
              email: credentials.email,
              password: hashedPassword
            }
          })
        }
        
        const isValid = await bcrypt.compare(credentials.password, admin.password || '')
        if (!isValid) return null
        
        return { id: admin.id, email: admin.email }
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}
