cat > app/boutique/page.tsx << 'EOF'
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function BoutiquePage() {
  const produits = await prisma.produit.findMany({
    orderBy: { createdAt: 'desc' }
  })

  if (produits.length === 0) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">La boutique ouvrira bientôt !</h1>
        <p className="text-gray-600">Revenez plus tard pour découvrir nos produits.</p>
      </main>
    )
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Nos produits</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produits.map((produit) => (
          <Link key={produit.id} href={`/boutique/${produit.id}`} className="border rounded-lg p-4 hover:shadow-lg">
            <img src={produit.imageUrl || "/placeholder.png"} alt={produit.nom} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{produit.nom}</h2>
            <p className="text-green-600 font-bold">{produit.prix.toFixed(2)} $</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
EOF
