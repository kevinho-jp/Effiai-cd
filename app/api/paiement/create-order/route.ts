import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  if (process.env.PAYPAL_MODE === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
  }
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment())
}

export async function POST(req: Request) {
  const { produitId, emailClient } = await req.json()
  
  const produit = await prisma.produit.findUnique({ where: { id: produitId } })
  if (!produit) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 })
  }

  const commande = await prisma.commande.create({
    data: {
      produitId: produit.id,
      emailClient,
      prixTotal: produit.prix,
      statutPaiement: "en_attente"
    }
  })

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: produit.prix.toFixed(2)
      },
      description: produit.nom,
      custom_id: commande.id
    }],
    application_context: {
      return_url: `${process.env.NEXTAUTH_URL}/paiement/succes`,
      cancel_url: `${process.env.NEXTAUTH_URL}/paiement/annule`
    }
  })

  try {
    const order = await client().execute(request)
    await prisma.commande.update({
      where: { id: commande.id },
      data: { paypalOrderId: order.result.id }
    })
    return NextResponse.json({ id: order.result.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur création paiement" }, { status: 500 })
  }
}
