cat > app/api/paiement/capture-order/route.ts << 'EOF'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
import { randomBytes } from "crypto"

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
  const { orderID } = await req.json()
  
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID)
  request.requestBody({})
  
  try {
    const capture = await client().execute(request)
    const purchaseUnit = capture.result.purchase_units[0]
    const commandeId = purchaseUnit.custom_id
    
    if (!commandeId) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 400 })
    }
    
    const commande = await prisma.commande.update({
      where: { id: commandeId },
      data: { statutPaiement: "paye" },
      include: { produit: true }
    })
    
    let lienTelechargement = null
    if (commande.produit.fichierUrl) {
      const token = randomBytes(16).toString('hex')
      lienTelechargement = `/telechargement/${commande.id}?token=${token}`
      await prisma.commande.update({
        where: { id: commandeId },
        data: { lienTelechargement }
      })
    }
    
    return NextResponse.json({ success: true, commande, lienTelechargement })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur capture" }, { status: 500 })
  }
}
EOF
