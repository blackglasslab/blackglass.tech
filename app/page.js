'use client'

import { useEffect, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle field
    const particleCount = 80
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
      })

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.25
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw a subtle wave/flow line across the bottom area
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.7)
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height * 0.7 +
          Math.sin(x * 0.008 + Date.now() * 0.0003) * 30 +
          Math.sin(x * 0.015 + Date.now() * 0.0005) * 15
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.75)
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height * 0.75 +
          Math.sin(x * 0.01 + Date.now() * 0.0004) * 25 +
          Math.sin(x * 0.018 + Date.now() * 0.0006) * 12
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <h1 className={styles.title}>blackglass</h1>
      </div>
    </main>
  )
}
