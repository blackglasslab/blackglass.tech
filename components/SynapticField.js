'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// A synaptic node: pulsing, connected, high-signal at connectivity peaks
// Fires bursts of activity along edges, like action potentials propagating

const EDGE_LENGTH = 180
const NODE_COUNT = 28
const REPULSION = 8000
const DAMPING = 0.85

function makeNodes(w, h) {
  const nodes = []
  for (let i = 0; i < NODE_COUNT; i++) {
    // Clump nodes a bit more in the center-top area for visual weight
    const cx = w * (0.3 + Math.random() * 0.4)
    const cy = h * (0.15 + Math.random() * 0.55)
    nodes.push({
      x: cx + (Math.random() - 0.5) * 100,
      y: cy + (Math.random() - 0.5) * 100,
      vx: 0, vy: 0,
      baseX: cx, baseY: cy,
      r: 2 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      // Every node has an intrinsic firing rhythm
      firingRate: 0.002 + Math.random() * 0.008,
      firingPhase: Math.random() * Math.PI * 2,
      // Current activity level (0-1)
      activity: Math.random() * 0.3,
      // Dragging state
      dragging: false,
      dragOffX: 0, dragOffY: 0,
    })
  }
  // Build edges based on proximity
  const edges = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].baseX - nodes[j].baseX
      const dy = nodes[i].baseY - nodes[j].baseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < EDGE_LENGTH) {
        edges.push({ a: i, b: j, dist })
      }
    }
  }
  return { nodes, edges }
}

export default function SynapticField() {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const dimsRef = useRef({ w: 0, h: 0 })
  const animRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const dragRef = useRef(null) // { nodeIdx, offX, offY } or null
  const [ready, setReady] = useState(false)

  const resize = useCallback(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    dimsRef.current = { w, h }
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = w
      canvas.height = h
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    resize()
    window.addEventListener('resize', resize)

    const w = dimsRef.current.w
    const h = dimsRef.current.h
    const { nodes, edges } = makeNodes(w, h)
    stateRef.current = { nodes, edges }

    // When a node fires, propagate activity along edges
    const propagateActivity = (idx, strength) => {
      const n = stateRef.current.nodes
      const e = stateRef.current.edges
      n[idx].activity = Math.min(1, n[idx].activity + strength)
      // Propagate to connected nodes with decay
      for (const edge of e) {
        let target = -1
        if (edge.a === idx) target = edge.b
        else if (edge.b === idx) target = edge.a
        if (target >= 0) {
          n[target].activity = Math.min(0.6, n[target].activity + strength * 0.4)
        }
      }
    }

    let fireCounter = 0

    const draw = () => {
      const { w, h } = dimsRef.current
      const { nodes, edges } = stateRef.current

      ctx.clearRect(0, 0, w, h)

      fireCounter++
      const now = Date.now()

      // --- Physics: each node is attracted back to its base position ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        if (n.dragging) {
          // While dragging, follow mouse but don't apply forces
          n.x = mouseRef.current.x + n.dragOffX
          n.y = mouseRef.current.y + n.dragOffY
          continue
        }

        // Attraction to base position
        const dx = n.baseX - n.x
        const dy = n.baseY - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 1) {
          n.vx += dx * 0.003
          n.vy += dy * 0.003
        }

        // Repulsion from mouse (subtle, like a field effect)
        const mx = mouseRef.current.x - n.x
        const my = mouseRef.current.y - n.y
        const mDist = Math.sqrt(mx * mx + my * my)
        if (mDist < 200 && mDist > 0.1) {
          const force = 15 / Math.max(mDist, 20)
          n.vx -= (mx / mDist) * force
          n.vy -= (my / mDist) * force
        }

        // Repulsion from other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j]
          const rdx = o.x - n.x
          const rdy = o.y - n.y
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy)
          if (rDist < 60 && rDist > 0.1) {
            const force = REPULSION / (rDist * rDist)
            const fx = (rdx / rDist) * force * 0.1
            const fy = (rdy / rDist) * force * 0.1
            n.vx -= fx
            n.vy -= fy
            o.vx += fx
            o.vy += fy
          }
        }

        // Damping
        n.vx *= DAMPING
        n.vy *= DAMPING

        n.x += n.vx
        n.y += n.vy

        // --- Intrinsic firing rhythm ---
        const fireSignal = Math.sin(now * n.firingRate + n.firingPhase)
        const firing = fireSignal > 0.85
        if (firing) {
          propagateActivity(i, 0.3 + Math.random() * 0.3)
        }

        // Activity decays
        n.activity *= 0.97
        if (n.activity < 0.01) n.activity = 0
      }

      // --- Draw edges (synaptic connections) ---
      for (const edge of edges) {
        const a = nodes[edge.a]
        const b = nodes[edge.b]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > EDGE_LENGTH * 1.3) continue

        const combinedActivity = (a.activity + b.activity) / 2
        const opacity = Math.max(0.04, combinedActivity * 0.5 + 0.03)
        const width = combinedActivity * 2 + 0.3

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = width
        ctx.stroke()
      }

      // --- Draw nodes ---
      for (const n of nodes) {
        const glow = n.activity * 12
        const r = n.r + n.activity * 2

        // Glow
        if (n.activity > 0.1) {
          const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${n.activity * 0.3})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.beginPath()
          ctx.arc(n.x, n.y, glow, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)

        if (n.activity > 0.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + n.activity * 0.5})`
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + n.activity * 0.3})`
        }
        ctx.fill()

        // Bright center for active nodes
        if (n.activity > 0.5) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${n.activity * 0.6})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    setReady(true)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [resize])

  // Mouse/touch handlers
  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const handleDown = useCallback((e) => {
    const pos = getPos(e)
    mouseRef.current = { x: pos.x, y: pos.y, active: true }
    const n = stateRef.current?.nodes
    if (!n) return
    // Find closest node within radius
    let closest = -1
    let closestDist = 30
    for (let i = 0; i < n.length; i++) {
      const dx = n[i].x - pos.x
      const dy = n[i].y - pos.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    }
    if (closest >= 0) {
      n[closest].dragging = true
      n[closest].dragOffX = n[closest].x - pos.x
      n[closest].dragOffY = n[closest].y - pos.y
      dragRef.current = closest
    }
  }, [getPos])

  const handleMove = useCallback((e) => {
    const pos = getPos(e)
    mouseRef.current = { x: pos.x, y: pos.y, active: true }
  }, [getPos])

  const handleUp = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000, active: false }
    if (dragRef.current !== null) {
      const n = stateRef.current?.nodes
      if (n && n[dragRef.current]) {
        n[dragRef.current].dragging = false
      }
      dragRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        cursor: dragRef.current !== null ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
    />
  )
}
