/**
 * SVG-based black-glass synaptic membrane.
 * Thin translucent filaments in the lower 35–45% of the viewport.
 * No particles, no stars, no galaxy. Just glass, curves, and junctions.
 * Static SVG — no client-side JavaScript needed.
 */
export default function GlassMembrane() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="glass-membrane-svg"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* Soft blur for thick glass base underlay */}
        <filter id="g-underlay" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>

        {/* Medium blur for mid glass base */}
        <filter id="g-mid" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>

        {/* Fine glow for thin filaments */}
        <filter id="g-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Static diagonal sheen overlay */}
        <linearGradient id="sheen-diag" x1="30%" y1="0%" x2="75%" y2="100%" gradientTransform="rotate(-28)">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="52%" stopColor="rgba(255,255,255,0)" />
          <stop offset="62%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="66%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="78%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Vignette */}
        <radialGradient id="vignette" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="55%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="85%" stopColor="rgba(0,0,0,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.75)" />
        </radialGradient>
      </defs>

      {/* === LAYER 0: Black background === */}
      <rect x="0" y="0" width="100" height="100" fill="#000" />

      {/* === LAYER 1: Thick glass underlay — very soft, blurry glow bands === */}
      <g filter="url(#g-underlay)" opacity="0.055">
        <path d="M-10,70 C12,58 28,72 45,62 C60,52 75,66 92,56 C108,46 118,60 130,54" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
        <path d="M-10,78 C22,68 38,80 55,70 C70,60 85,74 100,64 C115,54 125,68 135,60" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
        <path d="M-10,64 C18,54 35,66 50,56 C65,46 80,60 95,50 C110,40 122,54 130,48" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* === LAYER 2: Mid glass base — moderate blur === */}
      <g filter="url(#g-mid)" opacity="0.09">
        <path d="M-10,73 C15,62 30,74 48,65 C63,56 78,70 93,60 C108,50 118,64 130,56" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M-10,66 C22,56 38,68 55,58 C70,48 85,62 100,53 C115,44 125,58 135,50" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* === LAYER 3: Main thin white filaments === */}
      <g filter="url(#g-glow)">
        <path d="M-10,75 C10,64 25,77 42,67 C58,57 72,71 88,62 C104,53 114,67 125,58" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="round" />
        <path d="M-10,68 C15,58 30,70 48,60 C62,50 78,64 95,55 C110,46 120,60 130,52" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="0.95" strokeLinecap="round" />
        <path d="M-10,82 C20,73 35,84 52,75 C68,66 82,80 98,72 C112,64 122,78 132,70" fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="0.9" strokeLinecap="round" />
        <path d="M-10,62 C25,53 42,64 58,55 C74,46 88,58 105,50" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M22,57 C40,48 55,60 72,52 C88,44 102,56 118,48" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.7" strokeLinecap="round" />
      </g>

      {/* === LAYER 4: Branching inter-filament connectors === */}
      <g>
        {/* Vertical / near-vertical connectors between main curves */}
        <path d="M18,66 C16,70 20,74 18,78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.55" strokeLinecap="round" />
        <path d="M32,62 C30,66 34,70 32,74" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M45,59 C43,64 47,68 45,72" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M60,55 C58,59 62,63 60,67" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M76,56 C74,60 78,64 76,68" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M90,54 C88,58 92,62 90,66" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.45" strokeLinecap="round" />

        {/* Diagonal cross-branching */}
        <path d="M25,65 C29,70 27,75 31,79" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M52,60 C55,65 53,70 57,74" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M75,56 C78,61 76,66 80,70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M85,54 C82,58 84,63 81,67" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M38,64 C42,68 40,72 44,76" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M65,53 C69,57 67,62 71,66" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M95,56 C92,60 94,65 91,69" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M102,52 C99,56 101,61 98,65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeLinecap="round" />

        {/* Short terminal branches (dendritic spines) */}
        <path d="M14,63 C11,61 8,62 6,60" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M70,66 C73,69 76,68 78,71" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M90,75 C93,78 95,76 98,79" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M55,78 C52,81 50,79 47,82" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M108,58 C111,61 113,59 116,62" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" strokeLinecap="round" />
        <path d="M115,55 C112,59 114,63 111,66" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.35" strokeLinecap="round" />
      </g>

      {/* === LAYER 5: Highlight paths — brighter, thinner, floats above === */}
      <g>
        <path d="M18,70 C32,64 44,74 58,67 C70,60 82,70 96,64" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M26,65 C35,60 42,68 52,63 C60,58 68,66 78,61" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" strokeLinecap="round" />
      </g>

      {/* === LAYER 6: Junction nodes only at curve intersections === */}
      <g fill="rgba(255,255,255,0.18)">
        <circle cx="18" cy="66" r="1.1" />
        <circle cx="32" cy="62" r="0.9" />
        <circle cx="45" cy="59" r="1.3" />
        <circle cx="60" cy="55" r="0.9" />
        <circle cx="76" cy="56" r="1.1" />
        <circle cx="90" cy="54" r="0.8" />
        <circle cx="25" cy="65" r="0.8" />
        <circle cx="52" cy="60" r="0.9" />
        <circle cx="75" cy="56" r="0.7" />
        <circle cx="85" cy="54" r="0.65" />
        <circle cx="38" cy="64" r="0.9" />
        <circle cx="65" cy="53" r="0.8" />
        <circle cx="95" cy="56" r="0.7" />
        <circle cx="102" cy="52" r="0.6" />
        <circle cx="14" cy="63" r="0.7" />
        <circle cx="70" cy="66" r="0.7" />
      </g>

      {/* === LAYER 7: Very sparse glint points along curves === */}
      <g opacity="0.10">
        <circle cx="28" cy="64" r="0.45" fill="rgba(255,255,255,0.15)" />
        <circle cx="50" cy="58" r="0.4" fill="rgba(255,255,255,0.12)" />
        <circle cx="72" cy="60" r="0.45" fill="rgba(255,255,255,0.10)" />
        <circle cx="88" cy="65" r="0.35" fill="rgba(255,255,255,0.08)" />
        <circle cx="42" cy="72" r="0.35" fill="rgba(255,255,255,0.07)" />
        <circle cx="62" cy="70" r="0.3" fill="rgba(255,255,255,0.06)" />
        <circle cx="82" cy="76" r="0.3" fill="rgba(255,255,255,0.05)" />
        <circle cx="35" cy="78" r="0.3" fill="rgba(255,255,255,0.05)" />
        <circle cx="100" cy="60" r="0.3" fill="rgba(255,255,255,0.05)" />
        <circle cx="12" cy="70" r="0.35" fill="rgba(255,255,255,0.07)" />
      </g>

      {/* === LAYER 8: Glass reflection sheen overlay === */}
      <rect x="0" y="50" width="100" height="45" fill="url(#sheen-diag)" opacity="0.45" />

      {/* === LAYER 9: Vignette on top === */}
      <rect x="0" y="0" width="100" height="100" fill="url(#vignette)" />
    </svg>
  )
}
