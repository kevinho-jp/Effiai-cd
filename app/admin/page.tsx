import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const produits = await prisma.produit.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Link href="/admin/ajouter" className="bg-green-600 text-white px-4 py-2 rounded">+ Ajouter un produit</Link>
      </div>
      
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Image</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2"><img src={p.imageUrl || "/placeholder.png"} alt={p.nom} className="w-16 h-16 object-cover" /></td>
              <td>{p.nom}</td>
              <td>{p.prix} $</td>
              <td>
                <form action={`/api/produits/${p.id}`} method="POST">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" className="text-red-500">Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
