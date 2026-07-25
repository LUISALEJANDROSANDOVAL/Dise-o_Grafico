"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, LogIn, LogOut, LayoutDashboard, UserCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export type Profile = "entrepreneur" | "designer"

type Props = {
  profile?: Profile
  onProfileChange?: (p: Profile) => void
  theme: "light" | "dark"
  onThemeToggle: () => void
  hideProfileToggle?: boolean
}

export function RulecHeader({ profile = "entrepreneur", onProfileChange = () => {}, theme, onThemeToggle, hideProfileToggle = false }: Props) {
  const pathname = usePathname()
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = () => {
    supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo & Nav Group */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-foreground">CROMATIC</Link>
            <span className="hidden rounded-full bg-slate-200/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:inline">
              v1.0
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Profile toggle */}
        {!hideProfileToggle && (
          <div
            role="tablist"
            aria-label="Perfil de usuario"
            className="order-3 flex w-full items-center rounded-lg border border-border bg-muted/40 p-0.5 sm:order-none sm:w-auto"
          >
            {(
              [
                { id: "entrepreneur", label: "Microempresario" },
                { id: "designer", label: "Diseñador" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={profile === tab.id}
                onClick={() => onProfileChange(tab.id)}
                className={cn(
                  "relative flex-1 rounded-[calc(var(--radius)-2px)] px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:text-sm",
                  profile === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {profile === tab.id && (
                  <motion.span
                    layoutId="profile-pill"
                    className="absolute inset-0 rounded-[calc(var(--radius)-2px)] bg-background shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Auth controls */}
        {session ? (
          <div className={cn("flex items-center gap-2 pl-3 ml-1", !hideProfileToggle && "border-l border-border")}>
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2" asChild>
              <Link href="/mis-paletas">
                <LayoutDashboard className="h-4 w-4" />
                Mis Paletas
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
            {session.user?.user_metadata?.avatar_url ? (
              <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="h-8 w-8 rounded-full border border-border" />
            ) : (
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        ) : (
          <div className={cn("flex items-center gap-2 pl-3 ml-1", !hideProfileToggle && "border-l border-border")}>
            <Button variant="default" size="sm" onClick={handleSignIn} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <LogIn className="h-4 w-4" />
              <span>Iniciar Sesión</span>
            </Button>
          </div>
        )}

        {/* Theme toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onThemeToggle}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          className="ml-1"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        </div>
      </div>
    </header>
  )
}
