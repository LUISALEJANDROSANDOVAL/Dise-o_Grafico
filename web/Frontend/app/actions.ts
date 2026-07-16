"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function savePalette(data: { baseColor: string; scheme: string; swatches: string }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from('palettes').insert({
    user_id: session.user.id,
    base_color: data.baseColor,
    scheme: data.scheme,
    swatches: data.swatches,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/mis-paletas")
  return { success: true }
}

export async function getPalettes() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    return []
  }

  const { data: palettes } = await supabase
    .from('palettes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return palettes || []
}

export async function deletePalette(id: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from('palettes')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/mis-paletas")
  return { success: true }
}
