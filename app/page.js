import GlassMembrane from '../components/GlassMembrane'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Black background fill */}
      <div className={styles.bg} />

      {/* Glass membrane network */}
      <div className={styles.membrane}>
        <GlassMembrane />
      </div>

      {/* Foreground content */}
      <div className={styles.content}>
        <h1 className={styles.wordmark}>blackglass</h1>
        <p className={styles.subtitle}>agentic systems for scientific work</p>
        <nav className={styles.nav}>
          <a href="/tools" className={styles.navLink}>tools</a>
        </nav>
      </div>
    </main>
  )
}
