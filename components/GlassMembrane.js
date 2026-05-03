'use client'

import { useEffect, useRef, useCallback } from 'react'

// A structured glass/membrane network drawn with SVG-like splines on canvas.
// No random particles. Just flowing Bezier curves with synapse-like junctions.

export default function GlassMembrane() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)

  const buildNetwork = useCallback((w, h) => {
    // Define a set of master curves that form the membrane
    // Each curve is an array of control points: { x, y, cp1x, cp1y, cp2x, cp2y }
    const bottom = h * 0.95
    const top = h * 0.55
    const margin = w * 0.08

    const curves = [
      // Main sweep — left to right, undulating
      [
        { x: -margin, y: top + (bottom - top) * 0.6 },
        { x: w * 0.15, y: top + (bottom - top) * 0.35 },
        { x: w * 0.35, y: top + (bottom - top) * 0.55 },
        { x: w * 0.5, y: top + (bottom - top) * 0.3 },
        { x: w * 0.65, y: top + (bottom - top) * 0.5 },
        { x: w * 0.85, y: top + (bottom - top) * 0.35 },
        { x: w + margin, y: top + (bottom - top) * 0.55 },
      ],
      // Second sweep — offset, crossing
      [
        { x: -margin, y: top + (bottom - top) * 0.45 },
        { x: w * 0.2, y: top + (bottom - top) * 0.6 },
        { x: w * 0.4, y: top + (bottom - top) * 0.35 },
        { x: w * 0.55, y: top + (bottom - top) * 0.55 },
        { x: w * 0.7, y: top + (bottom - top) * 0.3 },
        { x: w * 0.9, y: top + (bottom - top) * 0.5 },
        { x: w + margin, y: top + (bottom - top) * 0.4 },
      ],
      // Third — lower, gentler
      [
        { x: -margin, y: top + (bottom - top) * 0.7 },
        { x: w * 0.25, y: top + (bottom - top) * 0.5 },
        { x: w * 0.45, y: top + (bottom - top) * 0.65 },
        { x: w * 0.6, y: top + (bottom - top) * 0.45 },
        { x: w * 0.8, y: top + (bottom - top) * 0.6 },
        { x: w + margin, y: top + (bottom - top) * 0.7 },
      ],
      // Fourth — upper, subtle
      [
        { x: -margin, y: top + (bottom - top) * 0.3 },
        { x: w * 0.3, y: top + (bottom - top) * 0.2 },
        { x: w * 0.5, y: top + (bottom - top) * 0.25 },
        { x: w * 0.7, y: top + (bottom - top) * 0.15 },
        { x: w + margin, y: top + (bottom - top) * 0.25 },
      ],
    ]

    // Compute intersection points as synapse nodes
    const junctions = []
    // Sample each curve densely and find nearby crossings
    const sampled = curves.map(curve => {
      const pts = []
      for (let t = 0; t <= 1; t += 0.01) {
        const p = catmullRomPoint(curve, t)
        pts.push(p)
      }
      return pts
    })

    // Find crossing points between curve pairs
    for (let i = 0; i < sampled.length; i++) {
      for (let j = i + 1; j < sampled.length; j++) {
        for (let ti = 0; ti < sampled[i].length - 1; ti += 2) {
          for (let tj = 0; tj < sampled[j].length - 1; tj += 2) {
            const a = sampled[i][ti]
            const b = sampled[j][tj]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 18) {
              // Check we don't double-add
              const tooClose = junctions.some(jn => {
                const jdx = jn.x - (a.x + b.x) / 2
                const jdy = jn.y - (a.y + b.y) / 2
                return Math.sqrt(jdx * jdx + jdy * jdy) < 20
              })
              if (!tooClose) {
                junctions.push({
                  x: (a.x + b.x) / 2,
                  y: (a.y + b.y) / 2,
                  r: 2 + Math.random() * 2,
                })
              }
            }
          }
        }
      }
    }

    // Add a few extra nodes at curve peaks
    for (const pts of sampled) {
      for (let i = 3; i < pts.length - 3; i += 7) {
        const p = pts[i]
        const tooClose = junctions.some(jn => {
          const dx = jn.x - p.x
          const dy = jn.y - p.y
          return Math.sqrt(dx * dx + dy * dy) < 25
        })
        if (!tooClose && p.y > top && p.y < bottom) {
          junctions.push({ x: p.x, y: p.y, r: 1.5 + Math.random() * 1.5 })
        }
      }
    }

    return { curves, junctions, sampled }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    let network

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      network = buildNetwork(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const { curves, junctions } = network
      const mx = mouseRef.current.x
      const time = Date.now() * 0.0001

      // Very subtle wave offset based on mouse + time
      const waveX = Math.sin(time) * 3 + (mx - 0.5) * 8
      const waveY = Math.cos(time * 0.7) * 2

      // Draw each curve as a smooth path
      for (let ci = 0; ci < curves.length; ci++) {
        const pts = curves[ci]
        ctx.beginPath()

        // Compute Catmull-Rom spline through points with offset
        const getY = (pt, idx) => {
          return pt.y + waveY + Math.sin(time + ci * 1.5 + idx * 0.3) * 3
        }
        const getX = (pt, idx) => {
          return pt.x + waveX * 0.3 + Math.sin(time * 0.8 + ci * 2 + idx * 0.2) * 2
        }

        const p0 = pts[0]
        ctx.moveTo(getX(p0, 0), getY(p0, 0))

        for (let i = 1; i < pts.length; i++) {
          const pPrev = pts[i - 1]
          const pCur = pts[i]
          const cp1x = (getX(pPrev, i - 1) + getX(pCur, i)) / 2
          const cp1y = getY(pPrev, i - 1)
          const cp2x = (getX(pPrev, i - 1) + getX(pCur, i)) / 2
          const cp2y = getY(pCur, i)
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, getX(pCur, i), getY(pCur, i))
        }

        // Line opacity varies by depth
        const lineOpacity = 0.12 + (ci / curves.length) * 0.12
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Draw secondary filaments branching between curves
      ctx.lineWidth = 0.3
      for (let i = 0; i < curves.length - 1; i++) {
        for (let j = 0; j < 3; j++) {
          const t = 0.15 + j * 0.3
          const idxA = Math.floor(t * (curves[i].length - 1))
          const idxB = Math.floor(t * (curves[i + 1].length - 1))
          const a = curves[i][Math.min(idxA, curves[i].length - 1)]
          const b = curves[i + 1][Math.min(idxB, curves[i + 1].length - 1)]
          const getY = (pt, idx) => pt.y + Math.sin(time + i + idx * 0.3) * 3
          const getX = (pt, idx) => pt.x + Math.sin(time * 0.8 + i + idx * 0.2) * 2

          ctx.beginPath()
          ctx.moveTo(getX(a, idxA), getY(a, idxA))
          ctx.quadraticCurveTo(
            (getX(a, idxA) + getX(b, idxB)) / 2 + Math.sin(time + j) * 5,
            (getY(a, idxA) + getY(b, idxB)) / 2 + Math.cos(time * 0.6 + j) * 3,
            getX(b, idxB),
            getY(b, idxB),
          )
          ctx.strokeStyle = `rgba(255, 255, 255, 0.04)`
          ctx.stroke()
        }
      }

      // Draw junction nodes (synapses)
      for (const jn of junctions) {
        const jx = jn.x + Math.sin(time + jn.x * 0.01) * 2
        const jy = jn.y + Math.cos(time * 0.8 + jn.y * 0.01) * 1.5
        const r = jn.r

        // Very subtle glow
        const grad = ctx.createRadialGradient(jx, jy, 0, jx, jy, r * 4)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(jx, jy, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Node dot
        ctx.beginPath()
        ctx.arc(jx, jy, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.fill()
      }

      // Glass reflection overlay — a diagonal gradient sheen
      const grad = ctx.createLinearGradient(
        w * 0.2, h * 0.4,
        w * 0.8, h * 0.7,
      )
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.0)')
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.015)')
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.025)')
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.015)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [buildNetwork])

  // Mouse tracking
  const handleMouse = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouse}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

// Catmull-Rom through points (curve is an array of {x,y} points)
// t is 0..1 along the curve
function catmullRomPoint(curve, t) {
  const n = curve.length
  const idx = t * (n - 1)
  const i = Math.floor(idx)
  const f = idx - i

  const p0 = curve[Math.max(0, i - 1)]
  const p1 = curve[i]
  const p2 = curve[Math.min(n - 1, i + 1)]
  const p3 = curve[Math.min(n - 1, i + 2)]

  if (!p1) return curve[0]
  if (!p2) return curve[n - 1]

  const t2 = f * f
  const t3 = t2 * f

  const x = 0.5 * (
    (2 * p1.x) +
    (-p0.x + p2.x) * f +
    (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
    (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
  )
  const y = 0.5 * (
    (2 * p1.y) +
    (-p0.y + p2.y) * f +
    (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
    (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
  )

  return { x, y }
}
