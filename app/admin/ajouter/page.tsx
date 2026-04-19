'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AjouterProduit() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await fetch('/api/produits', {
      method: 'POST',
      body: JSON.stringify({
        nom: formData.get('nom'),
        description: formData.get('description'),
        prix: parseFloat(formData.get('prix') as string),
        fichierUrl: formData.get('fichierUrl'),
        imageUrl: formData.get('imageUrl') || undefined
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      alert("Erreur lors de l'ajout")
    }
    setLoading(false)
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nom" placeholder="Nom" required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" required className="w-full border p-2 rounded" />
        <input name="prix" type="number" step="0.01" placeholder="Prix" required className="w-full border p-2 rounded" />
        <input name="fichierUrl" placeholder="URL du fichier" required className="w-full border p-2 rounded" />
        <input name="imageUrl" placeholder="URL de l'image (optionnel)" className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? "En cours..." : "Ajouter"}
        </button>
      </form>
    </main>
  )
}
