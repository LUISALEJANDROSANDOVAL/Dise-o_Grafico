"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function savePalette(data: { id?: string; baseColor: string; scheme: string; swatches: string }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (data.id) {
    const { error } = await supabase
      .from('paletas')
      .update({
        color_base: data.baseColor,
        esquema_tipo: data.scheme,
        colores: data.swatches,
      })
      .eq('id', data.id)
      .eq('usuario_id', session.user.id)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('paletas').insert({
      usuario_id: session.user.id,
      color_base: data.baseColor,
      esquema_tipo: data.scheme,
      colores: data.swatches,
    })

    if (error) throw new Error(error.message)
  }

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
    .from('paletas')
    .select('*')
    .eq('usuario_id', session.user.id)
    .order('creado_en', { ascending: false })

  return palettes || []
}

export async function deletePalette(id: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from('paletas')
    .delete()
    .eq('id', id)
    .eq('usuario_id', session.user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/mis-paletas")
  return { success: true }
}
