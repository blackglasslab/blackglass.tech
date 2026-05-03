'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

const GlassMembrane = dynamic(() => import('../components/GlassMembrane'), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Stagger fade: wordmark first, then membrane
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className={styles.main}>
      {/* Vignette overlay */}
      <div className={styles.vignette} />

      {/* Glass membrane network */}
      <div className={`${styles.membrane} ${mounted ? styles.visible : ''}`}>
        <GlassMembrane />
      </div>

      {/* Foreground content */}
      <div className={`${styles.content} ${mounted ? styles.visible : ''}`}>
        <h1 className={styles.wordmark}>blackglass</h1>
        <p className={styles.subtitle}>agentic systems for scientific work</p>
      </div>
    </main>
  )
}
