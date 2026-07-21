"use client"

import { useEffect, useRef } from "react"

export function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    
    // Mouse tracking
    const mouse = { x: -1000, y: -1000, radius: 150 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        // Slower, elegant movement
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.size = Math.random() * 2 + 0.5
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) this.vx = -this.vx
        if (this.y < 0 || this.y > canvasHeight) this.vy = -this.vy
        
        // Interaction with mouse (Repel effect)
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          // The closer the mouse, the stronger the force
          const force = (mouse.radius - distance) / mouse.radius
          this.x -= forceDirectionX * force * 2.5
          this.y -= forceDirectionY * force * 2.5
        }
      }

      draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(59, 130, 246, 0.4)"
        ctx.fill()
      }
    }

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Density based on screen size
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000)
      particles = []
      for (let i = 0; i < Math.min(particleCount, 150); i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const animate = () => {
      const isDark = document.documentElement.classList.contains("dark")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height)
        particles[i].draw(ctx, isDark)
        
        // Connect close particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 110) {
            ctx.beginPath()
            const opacity = 1 - distance / 110
            ctx.strokeStyle = isDark 
              ? `rgba(255, 255, 255, ${opacity * 0.15})` 
              : `rgba(99, 102, 241, ${opacity * 0.15})` // Indigo tint in light mode
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(init, 200)
    }
    
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80 mix-blend-screen dark:opacity-100"
    />
  )
}
