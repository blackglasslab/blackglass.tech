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
            <h1 className={styles.lockIcon}>⬡</h1>
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
