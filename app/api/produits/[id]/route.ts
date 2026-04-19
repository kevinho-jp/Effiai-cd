import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const produit = await prisma.produit.findUnique({
    where: { id }
  })
  if (!produit) {
    return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
  }
  return NextResponse.json(produit)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params
  await prisma.produit.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
