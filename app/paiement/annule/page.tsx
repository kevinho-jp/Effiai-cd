export default function AnnulePage() {
  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Paiement annulé</h1>
      <p className="mt-2">Votre transaction a été annulée. Vous pouvez réessayer.</p>
      <a href="/boutique" className="mt-4 inline-block text-blue-600 underline">Retour à la boutique</a>
    </main>
  )
}
