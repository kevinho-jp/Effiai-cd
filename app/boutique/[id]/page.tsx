'use client'

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"

export default function ProduitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [produit, setProduit] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [showPayPal, setShowPayPal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/produits/${id}`)
      .then(res => res.json())
      .then(data => setProduit(data))
  }, [id])

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
  }

  const createOrder = async () => {
    const res = await fetch("/api/paiement/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produitId: produit.id, emailClient: email })
    })
    const data = await res.json()
    return data.id
  }

  const onApprove = async (data: any) => {
    const res = await fetch("/api/paiement/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID })
    })
    const result = await res.json()
    if (result.success) {
      if (result.lienTelechargement) {
        router.push(result.lienTelechargement)
      } else {
        router.push("/paiement/succes")
      }
    }
  }

  if (!produit) return <div className="p-8 text-center">Chargement...</div>

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <img src={produit.imageUrl || "/placeholder.png"} alt={produit.nom} className="w-full h-64 object-cover rounded" />
      <h1 className="text-3xl font-bold mt-4">{produit.nom}</h1>
      <p className="text-gray-700 my-4">{produit.description}</p>
      <p className="text-2xl font-bold text-green-600">{produit.prix.toFixed(2)} $</p>
      
      {!showPayPal ? (
        <div className="mt-6">
          <input 
            type="email" 
            placeholder="Votre email pour recevoir le produit" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button 
            onClick={() => setShowPayPal(true)}
            disabled={!email}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
          >
            Payer avec PayPal
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons 
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </main>
  )
}
