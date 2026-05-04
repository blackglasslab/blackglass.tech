'use client'

import { useState, useEffect } from 'react'
import GlassMembrane from '../../components/GlassMembrane'
import styles from './page.module.css'

const CORRECT_PASSWORD = 'pasc0111'

export default function DarkMatterPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    const authed = sessionStorage.getItem('darkmatter_auth')
    if (authed === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (!authenticated) return
    fetch('/api/dark-matter-episodes')
      .then(r => r.json())
      .then(data => setEpisodes(data.episodes || []))
      .catch(() => {})
  }, [authenticated])

  function handleSubmit(e) {
    e.preventDefault()
    if (password === CORRECT_PASSWORD) {
      setAuthenticated(true)
      setError(false)
      sessionStorage.setItem('darkmatter_auth', 'true')
    } else {
      setError(true)
    }
  }

  if (!authenticated) {
    return (
      <main className={styles.main}>
        <div className={styles.bg} />
        <div className={styles.membrane}><GlassMembrane /></div>
        <div className={styles.content}>
          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>blackglass</a>
            <span className={styles.navCurrent}>dark matter</span>
          </nav>
          <div className={styles.lock}>
            <svg className={styles.lockIcon} width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
              <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.15" />
              <path d="M6 24 Q 12 14, 24 12 Q 36 10, 42 24" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M6 24 Q 12 34, 24 36 Q 36 38, 42 24" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
              <path d="M24 6 Q 14 12, 12 24 Q 10 36, 24 42" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
              <path d="M24 6 Q 34 12, 36 24 Q 38 36, 24 42" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" />
            </svg>
            <h2 className={styles.lockTitle}>Dark Matter</h2>
            <p className={styles.lockDesc}>This feed is private. Enter the passphrase to listen.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                placeholder="passphrase"
                className={styles.input}
                autoFocus
              />
              {error && <p className={styles.error}>wrong passphrase</p>}
              <button type="submit" className={styles.button}>unlock</button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.bg} />
      <div className={styles.membrane}><GlassMembrane /></div>
      <div className={styles.content}>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>blackglass</a>
          <span className={styles.navCurrent}>dark matter</span>
        </nav>

        <div className={styles.header}>
          <svg className={styles.headerIcon} width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
            <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
            <circle cx="20" cy="20" r="2.5" fill="currentColor" opacity="0.08" />
          </svg>
          <h1 className={styles.title}>Dark Matter</h1>
          <p className={styles.subtitle}>briefings from the unseen space between onyx and blackglass</p>
        </div>

        <div className={styles.episodeList}>
          {episodes.length === 0 && (
            <p className={styles.empty}>No episodes yet. The first one is on its way.</p>
          )}
          {episodes.map((ep, i) => (
            <div key={i} className={styles.episode}>
              <div className={styles.epNumber}>#{i + 1}</div>
              <div className={styles.epBody}>
                <h3 className={styles.epTitle}>{ep.title}</h3>
                <p className={styles.epDate}>{ep.date}</p>
                <p className={styles.epDesc}>{ep.description}</p>
                <audio controls className={styles.audio}>
                  <source src={ep.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
