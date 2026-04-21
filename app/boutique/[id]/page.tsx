import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const produit = await prisma.produit.findUnique({ where: { id } })
  
  if (!produit) notFound()
  
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <img src={produit.imageUrl || "/placeholder.png"} alt={produit.nom} className="w-full h-64 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{produit.nom}</h1>
      <p className="text-gray-700 my-4">{produit.description}</p>
      <p className="text-2xl font-bold text-green-600">{produit.prix.toFixed(2)} $</p>
      <p className="mt-6 text-gray-500">Paiement bientôt disponible.</p>
    </main>
  )
}
