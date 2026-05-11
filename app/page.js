'use client'

import { useEffect } from 'react'
import styles from './page.module.css'

function startNetwork(canvas, count, maxDist, speed) {
  const ctx = canvas.getContext('2d')
  let width = 0
  let height = 0
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  let nodes = []
  let pulses = []
  let raf = null

  const buildNodes = () => Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    r: 1 + Math.random() * 2,
    ph: Math.random() * 7,
  }))

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    width = rect.width
    height = rect.height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    nodes = buildNodes()
  }

  const pairs = () => {
    const out = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.hypot(dx, dy)
        if (dist < maxDist) out.push([i, j, dist])
      }
    }
    return out
  }

  const draw = (t) => {
    ctx.clearRect(0, 0, width, height)
    const links = pairs()

    links.forEach(([i, j, dist]) => {
      ctx.strokeStyle = `rgba(244,242,236,${(1 - dist / maxDist) * 0.24})`
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(nodes[i].x, nodes[i].y)
      ctx.lineTo(nodes[j].x, nodes[j].y)
      ctx.stroke()
    })

    if (Math.random() < 0.07 && links.length) {
      const link = links[Math.floor(Math.random() * links.length)]
      pulses.push({ a: link[0], b: link[1], t: 0, s: 0.012 + Math.random() * 0.015 })
    }

    pulses.forEach((p) => {
      p.t += p.s
      const a = nodes[p.a]
      const b = nodes[p.b]
      const x = a.x + (b.x - a.x) * p.t
      const y = a.y + (b.y - a.y) * p.t

      const glow = ctx.createRadialGradient(x, y, 0, x, y, 18)
      glow.addColorStop(0, 'rgba(244,242,236,.8)')
      glow.addColorStop(1, 'rgba(244,242,236,0)')

      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, 18, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = 'rgba(244,242,236,.95)'
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    pulses = pulses.filter((p) => p.t < 1)

    nodes.forEach((n) => {
      n.x += n.vx + Math.sin(t * 0.0008 + n.ph) * 0.04
      n.y += n.vy + Math.cos(t * 0.0007 + n.ph) * 0.04

      if (n.x < -30) n.x = width + 30
      if (n.x > width + 30) n.x = -30
      if (n.y < -30) n.y = height + 30
      if (n.y > height + 30) n.y = -30

      ctx.fillStyle = 'rgba(244,242,236,.52)'
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fill()
    })

    raf = requestAnimationFrame(draw)
  }

  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(draw)

  return () => {
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}

export default function Home() {
  useEffect(() => {
    const network = document.getElementById('network-canvas')
    const synapse = document.getElementById('synapse-canvas')
    if (!network || !synapse) return undefined

    const stopA = startNetwork(network, 96, 165, 0.2)
    const stopB = startNetwork(synapse, 56, 210, 0.08)

    return () => {
      stopA?.()
      stopB?.()
    }
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.noise} />

      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <span className={styles.mark} />
            <span>Blackglass</span>
          </div>
          <div className={styles.links}>
            <a href="#identity">Identity</a>
            <a href="#synaptic-map">Synaptic map</a>
            <a href="/tools">Enter network</a>
          </div>
        </nav>
      </header>

      <section className={styles.hero} id="identity">
        <canvas id="network-canvas" className={styles.canvas} />
        <div className={styles.content}>
          <div>
            <div className={styles.eyebrow}><span className={styles.dot} />Biological reasoning systems</div>
            <h1>Tools for minds moving through living data.</h1>
            <p className={styles.copy}>
              Blackglass builds agentic research infrastructure: voice to structured knowledge,
              papers to navigable claims, experiments to decision maps, and biological complexity
              to usable intelligence.
            </p>
            <div className={styles.buttons}>
              <a href="#synaptic-map" className={styles.btn}>Explore the map</a>
              <a href="/dark-matter" className={`${styles.btn} ${styles.btn2}`}>Define the system</a>
            </div>
          </div>

          <aside className={styles.card}>
            <div className={styles.cardTitle}>Network translation layer</div>
            <div className={styles.item}><div className={styles.num}>01</div><div><strong>Capture</strong><span>Messy human input: voice notes, talks, PDFs, datasets, protocols.</span></div></div>
            <div className={styles.item}><div className={styles.num}>02</div><div><strong>Structure</strong><span>Transform raw information into claims, methods, tasks, evidence, and decisions.</span></div></div>
            <div className={styles.item}><div className={styles.num}>03</div><div><strong>Navigate</strong><span>Move through the knowledge network instead of searching flat documents.</span></div></div>
            <div className={styles.item}><div className={styles.num}>04</div><div><strong>Act</strong><span>Agents turn insight into next actions: drafts, analyses, summaries, workflows.</span></div></div>
          </aside>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>Corporate design direction</div>
            <h2>Black glass, living signal, precise machinery.</h2>
          </div>
          <div>
            <p className={styles.large}>
              The visual identity should feel like a dark laboratory instrument, a neural field,
              and a machine interface at the same time. Not cyberpunk neon. Not friendly SaaS.
              More: quiet intelligence, biological depth, controlled systems.
            </p>
            <div className={styles.principle}><strong>Color</strong><p>Near-black background, warm white typography, low-contrast glass surfaces, restrained signal highlights.</p></div>
            <div className={styles.principle}><strong>Motion</strong><p>Information travels through networks: pulses, flows, local activations, branching paths.</p></div>
            <div className={styles.principle}><strong>Forms</strong><p>Nodes, synapses, glass panels, thin lines, microscopic fields, and navigable knowledge maps.</p></div>
          </div>
        </div>
      </section>

      <section className={styles.syn} id="synaptic-map">
        <canvas id="synapse-canvas" className={styles.canvas} />
        <div className={styles.gridSyn}>
          <div>
            <div className={styles.label}>Scrollable transition</div>
            <h2>The network becomes a map.</h2>
            <p className={styles.largeSyn}>At the bottom, the abstract moving mesh condenses into a usable synaptic map. Each node can become a product, project, publication theme, or tool category.</p>
            <div className={styles.info}>Agent layer: Onyx, Jet, and specialized tools operate on the network instead of isolated files.</div>
          </div>
          <div className={styles.panel}>
            <div className={styles.mapLabel}>Synaptic navigation / prototype</div>
            <div className={`${styles.node} ${styles.research}`}>Research graph</div>
            <div className={`${styles.node} ${styles.voice}`}>Voice drop</div>
            <div className={`${styles.node} ${styles.agents}`}>Agent layer</div>
            <div className={`${styles.node} ${styles.omics}`}>Omics workflows</div>
            <div className={`${styles.node} ${styles.clinic}`}>Clinical bridge</div>
          </div>
        </div>
      </section>

      <section className={styles.tokens}>
        <div className={styles.tokenWrap}>
          <div className={styles.label}>Design system v0.1</div>
          <h2>Reusable identity tokens.</h2>
          <div className={styles.swatches}>
            <div className={`${styles.sw} ${styles.black}`}>#030405<br />Primary black</div>
            <div className={`${styles.sw} ${styles.soft}`}>#080A0D<br />Soft black</div>
            <div className={`${styles.sw} ${styles.fg}`}>#F4F2EC<br />Warm white</div>
            <div className={`${styles.sw} ${styles.muted}`}>#9B9A93<br />Muted stone</div>
            <div className={`${styles.sw} ${styles.accent}`}>#D8D2C0<br />Signal cream</div>
          </div>
          <div className={styles.typeGrid}>
            <div className={styles.typeBox}>
              <div className={styles.monoSample}>Display type</div>
              <div className={styles.displaySample}>Living data, instrument logic.</div>
            </div>
            <div className={styles.typeBox}>
              <div className={styles.monoSample}>System label</div>
              <p className={styles.large}>Monospace labels create the feeling of a laboratory interface and machine-readable control layer.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
