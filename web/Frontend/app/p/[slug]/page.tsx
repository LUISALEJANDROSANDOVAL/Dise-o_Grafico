import { redirect } from "next/navigation"

export default async function SharedPalettePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  if (!resolvedParams.slug) {
    redirect("/herramienta")
  }

  // Redirect to the tool, passing the slug as the palette 'p' parameter
  redirect(`/herramienta?p=${resolvedParams.slug}`)
}
