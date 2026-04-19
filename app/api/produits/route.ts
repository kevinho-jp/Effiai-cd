import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const produits = await prisma.produit.findMany()
  return NextResponse.json(produits)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const data = await req.json()
  const produit = await prisma.produit.create({ data })
  return NextResponse.json(produit, { status: 201 })
}
