"use client"

import { useEffect, useState } from "react"
import { RulecHeader, type Profile } from "@/components/rulec-header"

export default function ElegirNombrePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [profile, setProfile] = useState<Profile>("entrepreneur")

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <RulecHeader
        profile={profile}
        onProfileChange={setProfile}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 py-12 md:py-16">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Cómo elegir un nombre adecuado para tu empresa
          </h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            El nombre de tu marca es tu primera carta de presentación. Aquí tienes una guía rápida para tomar la mejor decisión sin ser un experto.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Tip 1 */}
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
            <h2 className="text-xl font-semibold">Fácil de pronunciar y recordar</h2>
            <p className="text-muted-foreground">
              Evita nombres demasiado largos o con ortografía complicada. Si tienes que deletrearlo varias veces, probablemente sea demasiado complejo. Un buen nombre fluye de manera natural.
            </p>
          </section>

          {/* Tip 2 */}
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">2</div>
            <h2 className="text-xl font-semibold">Que refleje la esencia</h2>
            <p className="text-muted-foreground">
              El nombre no necesita describir exactamente lo que haces, pero sí debe transmitir la <strong>emoción o valor</strong> correcto. (Ejemplo: "Nike" inspira victoria, no dice "Zapatos Deportivos").
            </p>
          </section>

          {/* Tip 3 */}
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">3</div>
            <h2 className="text-xl font-semibold">Evita modas pasajeras</h2>
            <p className="text-muted-foreground">
              No uses prefijos o sufijos solo porque están de moda (como "i-Algo" o "Algo-ify"). Piensa en un nombre que pueda seguir sonando bien dentro de 10 años.
            </p>
          </section>

          {/* Tip 4 */}
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">4</div>
            <h2 className="text-xl font-semibold">Verifica la disponibilidad</h2>
            <p className="text-muted-foreground">
              Antes de encariñarte con un nombre, busca si está disponible el dominio web (.com, .net, etc.) y revisa que no haya otra marca usándolo en las redes sociales que planeas utilizar.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
