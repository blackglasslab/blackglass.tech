import GlassMembrane from '../components/GlassMembrane'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Brand */}
      <div className={styles.brand}>
        <h1 className={styles.wordmark}>blackglass</h1>
        <div className={styles.subtitle}>agentic systems for scientific work</div>
      </div>

      {/* Glass membrane network */}
      <div className={styles.membrane}>
        <GlassMembrane />
      </div>

      {/* Glass reflection overlay */}
      <div className={styles.reflection} />

      {/* Vignette */}
      <div className={styles.vignette} />
    </main>
  )
}
