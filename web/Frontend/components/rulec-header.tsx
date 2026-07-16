"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Profile = "entrepreneur" | "designer"

type Props = {
  profile: Profile
  onProfileChange: (p: Profile) => void
  theme: "light" | "dark"
  onThemeToggle: () => void
}

export function RulecHeader({ profile, onProfileChange, theme, onThemeToggle }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo & Nav Group */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-semibold tracking-[-0.04em] text-foreground">RULEC</Link>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
              v1.0
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link 
              href="/" 
              className={cn("text-sm font-medium transition-colors hover:text-foreground", pathname === "/" ? "text-foreground" : "text-muted-foreground")}
            >
              Herramienta
            </Link>
            <Link 
              href="/elegir-nombre" 
              className={cn("text-sm font-medium transition-colors hover:text-foreground", pathname === "/elegir-nombre" ? "text-foreground" : "text-muted-foreground")}
            >
              Elegir Nombre
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Profile toggle */}
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

        {/* Theme toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onThemeToggle}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
        </div>
      </div>
    </header>
  )
}
