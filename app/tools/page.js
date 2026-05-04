import GlassMembrane from '../../components/GlassMembrane'
import styles from './page.module.css'

export const metadata = {
  title: 'Blackglass Tools — Voice Drop',
  description: 'Local-first AI-native tools for turning messy thoughts into usable artifacts.',
}

const modes = [
  'Raw transcript', 'Clean text', 'Email', 'Diary',
  'Meeting notes', 'Tasks', 'Research idea', 'Grant paragraph',
]

export default function ToolsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.bg} />

      <div className={styles.membrane}>
        <GlassMembrane />
      </div>

      <div className={styles.content}>

        {/* ---- Nav ---- */}
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>blackglass</a>
          <span className={styles.navCurrent}>tools</span>
        </nav>

        {/* ---- Page heading ---- */}
        <h1 className={styles.pageTitle}>tools</h1>
        <p className={styles.pageTagline}>
          small, local-first utilities for AI-native work.
        </p>

        {/* ---- Tool card: Voice Drop ---- */}
        <section className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <span className={styles.toolIcon}>▼</span>
            <div>
              <h2 className={styles.toolName}>Voice Drop</h2>
              <p className={styles.toolTagline}>Speak messily. Get usable text.</p>
            </div>
          </div>

          <p className={styles.toolDescription}>
            A tiny local-first voice utility for people whose thoughts do not arrive in neat sentences.
            Press a shortcut, speak freely, and turn the recording into a transcript, clean note, email,
            meeting summary, diary entry, task list, or research idea.
          </p>

          {/* ---- Modes ---- */}
          <div className={styles.modesSection}>
            <h3 className={styles.sectionLabel}>Output modes</h3>
            <div className={styles.modesGrid}>
              {modes.map((m) => (
                <span key={m} className={styles.modePill}>{m}</span>
              ))}
            </div>
          </div>

          {/* ---- Feature highlights ---- */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>◈</span>
              <span>Local-first transcription — audio stays on your machine.</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>◈</span>
              <span>Clipboard-native output. Copy or save as Markdown. No app silo.</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>◈</span>
              <span>Built for messy, half-formed, high-context thinking.</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>◈</span>
              <span>Optional AI cleanup with your own API key.</span>
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div className={styles.cta}>
            <p className={styles.ctaStatus}>In development — early build coming soon.</p>
            <a
              href="mailto:stefanie@baderlab.de?subject=Blackglass%20Voice%20Drop%20early%20access"
              className={styles.ctaButton}
            >
              Request early access →
            </a>
          </div>
        </section>

        {/* ---- Future tools placeholder ---- */}
        <div className={styles.future}>
          <p className={styles.futureText}>More tools are being shaped.</p>
        </div>

        {/* ---- Footer ---- */}
        <footer className={styles.footer}>
          <p>blackglass.tech — agentic systems for scientific work</p>
        </footer>
      </div>
    </main>
  )
}
