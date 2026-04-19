import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const produit = await prisma.produit.findUnique({
    where: { id: params.id }
  })
  if (!produit) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }
  return NextResponse.json(produit)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  await prisma.produit.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
