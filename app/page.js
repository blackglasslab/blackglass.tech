'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const SynapticField = dynamic(() => import('../components/SynapticField'), { ssr: false })

const PAGES = [
  { id: 'onyx', label: 'onyx', active: true },
  { id: 'systems', label: 'systems', active: true },
  { id: 'research', label: 'research', active: true },
  { id: 'contact', label: 'contact', active: true },
]

function PageContent({ page }) {
  switch (page) {
    case 'onyx':
      return (
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Onyx</h2>
          <p className={styles.pageDesc}>
            A steady machine familiar. Chief of staff with builder energy —
            structuring chaos, reducing drag, and helping good decisions happen
            faster.
          </p>
        </div>
      )
    case 'systems':
      return (
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Systems</h2>
          <p className={styles.pageDesc}>
            Agentic infrastructure for scientific workflows. Custom tools,
            automated pipelines, persistent memory, and intelligent
            orchestration across domains.
          </p>
        </div>
      )
    case 'research':
      return (
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Research</h2>
          <p className={styles.pageDesc}>
            Building at the biology–computation interface. Post-acute infection
            syndromes, systems medicine, biomarker discovery, and platforms
            that accelerate how science gets done.
          </p>
        </div>
      )
    case 'contact':
      return (
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Contact</h2>
          <p className={styles.pageDesc}>
            Reach out — we are building things.
          </p>
        </div>
      )
    default:
      return null
  }
}

export default function Home() {
  const [active, setActive] = useState(null)

  const showNav = active === null

  return (
    <div className={styles.container}>
      <SynapticField />

      {/* Wordmark */}
      <div className={`${styles.wordmark} ${active !== null ? styles.wordmarkSmall : ''}`}>
        blackglass
      </div>

      {/* Navigation (shown only on start page) */}
      {showNav && (
        <nav className={styles.nav}>
          {PAGES.map((p) => (
            <button
              key={p.id}
              className={styles.navItem}
              onClick={() => setActive(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
      )}

      {/* Inner page content */}
      {active !== null && (
        <div className={styles.pageOverlay}>
          <button className={styles.backBtn} onClick={() => setActive(null)}>
            ← back
          </button>
          <PageContent page={active} />
        </div>
      )}
    </div>
  )
}
