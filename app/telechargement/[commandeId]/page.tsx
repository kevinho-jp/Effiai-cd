import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function TelechargementPage({ 
  params, 
  searchParams 
}: { 
  params: { commandeId: string }, 
  searchParams: { token: string } 
}) {
  const commande = await prisma.commande.findUnique({
    where: { id: params.commandeId },
    include: { produit: true }
  })
  
  if (!commande || commande.statutPaiement !== "paye") {
    notFound()
  }
  
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Merci pour votre achat !</h1>
      <p>Votre produit est prêt à être téléchargé.</p>
      <a 
        href={commande.produit.fichierUrl} 
        className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded"
        download
      >
        Télécharger {commande.produit.nom}
      </a>
    </main>
  )
}
