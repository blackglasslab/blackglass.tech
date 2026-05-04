/**
 * SVG-based black-glass synaptic membrane.
 * Thin translucent filaments in the lower third of the viewport.
 * No particles, no stars, no galaxy. Just glass, curves, and junctions.
 *
 * Ported from ChatGPT reference with side-fade mask, proper node glows,
 * highlight shimmer, and glass reflection overlay.
 */
export default function GlassMembrane() {
  return (
    <svg
      viewBox="0 0 1440 520"
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
        <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="nodeBlur" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="glintBlur" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        <linearGradient id="fadeSides" x1="0" x2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="10%" stopColor="white" stopOpacity="1" />
          <stop offset="88%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id="sideFade">
          <rect width="1440" height="520" fill="url(#fadeSides)" />
        </mask>
      </defs>

      <rect width="1440" height="520" fill="transparent" />

      <g mask="url(#sideFade)">
        {/* === Very soft glass underlay: faint material presence === */}
        <path d="M -120 315 C 115 245, 260 288, 420 248 S 725 175, 895 252 S 1190 355, 1570 235"
          fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="7" strokeLinecap="round" filter="url(#softBlur)" />
        <path d="M -110 385 C 120 330, 285 380, 468 325 S 770 250, 965 314 S 1245 425, 1560 352"
          fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="7" strokeLinecap="round" filter="url(#softBlur)" />
        <path d="M -140 265 C 80 205, 248 230, 410 210 S 704 158, 874 205 S 1168 282, 1560 195"
          fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="7" strokeLinecap="round" filter="url(#softBlur)" />

        {/* === Main lower membrane: delicate irregular filaments === */}
        <path d="M -120 315 C 115 245, 260 288, 420 248 S 725 175, 895 252 S 1190 355, 1570 235"
          fill="none" stroke="rgba(255,255,255,0.115)" strokeWidth="1.15" strokeLinecap="round" />
        <path d="M -110 385 C 120 330, 285 380, 468 325 S 770 250, 965 314 S 1245 425, 1560 352"
          fill="none" stroke="rgba(255,255,255,0.115)" strokeWidth="1.15" strokeLinecap="round" />
        <path d="M -140 265 C 80 205, 248 230, 410 210 S 704 158, 874 205 S 1168 282, 1560 195"
          fill="none" stroke="rgba(255,255,255,0.115)" strokeWidth="1.15" strokeLinecap="round" />

        {/* Ghost filaments — even more subtle */}
        <path d="M -120 455 C 150 408, 315 472, 520 405 S 790 346, 1022 386 S 1265 474, 1555 430"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M -80 222 C 130 175, 325 215, 495 180 S 760 126, 948 168 S 1210 232, 1540 148"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />

        {/* Ghost connecting arcs */}
        <path d="M 235 344 C 298 322, 354 330, 412 356"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M 520 405 C 555 348, 612 315, 690 308"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M 758 160 C 820 126, 898 128, 948 168"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M 1082 225 C 1134 205, 1204 214, 1278 223"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />
        <path d="M 690 308 C 765 286, 838 292, 965 314"
          fill="none" stroke="rgba(255,255,255,0.065)" strokeWidth="0.65" strokeLinecap="round" />

        {/* === Fine secondary filaments, branching and reconnecting === */}
        <path d="M 280 286 C 330 244, 376 238, 420 248"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 420 248 C 448 202, 488 176, 548 178"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 420 248 C 474 276, 522 292, 588 273"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 610 203 C 650 152, 704 142, 758 160"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 610 203 C 674 235, 734 252, 795 228"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 895 252 C 950 210, 1014 203, 1082 225"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 895 252 C 934 305, 980 340, 1054 332"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 1168 282 C 1215 235, 1278 223, 1342 250"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M 1168 282 C 1203 330, 1262 366, 1326 356"
          fill="none" stroke="rgba(255,255,255,0.19)" strokeWidth="0.75" strokeLinecap="round" />

        {/* === Highlight filaments with shimmer animation === */}
        <path className="membrane-highlight"
          d="M -120 315 C 115 245, 260 288, 420 248 S 725 175, 895 252 S 1190 355, 1570 235" />
        <path className="membrane-highlight" style={{ animationDelay: '-7s' }}
          d="M -110 385 C 120 330, 285 380, 468 325 S 770 250, 965 314 S 1245 425, 1560 352" />
        <path className="membrane-highlight" style={{ animationDelay: '-12s' }}
          d="M -140 265 C 80 205, 248 230, 410 210 S 704 158, 874 205 S 1168 282, 1560 195" />

        {/* === Junction nodes: only at real intersections, not random === */}
        <g>
          <circle cx="420" cy="248" r="9" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="420" cy="248" r="2.4" fill="rgba(255,255,255,0.62)" />

          <circle cx="610" cy="203" r="8" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="610" cy="203" r="2.2" fill="rgba(255,255,255,0.62)" />

          <circle cx="758" cy="160" r="7" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="758" cy="160" r="2" fill="rgba(255,255,255,0.62)" />

          <circle cx="895" cy="252" r="9" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="895" cy="252" r="2.5" fill="rgba(255,255,255,0.62)" />

          <circle cx="965" cy="314" r="8" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="965" cy="314" r="2.2" fill="rgba(255,255,255,0.62)" />

          <circle cx="1168" cy="282" r="9" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="1168" cy="282" r="2.5" fill="rgba(255,255,255,0.62)" />

          <circle cx="1278" cy="223" r="7" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="1278" cy="223" r="2" fill="rgba(255,255,255,0.62)" />

          <circle cx="520" cy="405" r="7" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="520" cy="405" r="1.9" fill="rgba(255,255,255,0.62)" />

          <circle cx="690" cy="308" r="8" fill="rgba(255,255,255,0.10)" filter="url(#nodeBlur)" />
          <circle cx="690" cy="308" r="2.1" fill="rgba(255,255,255,0.62)" />
        </g>

        {/* === Sparse glass glints: sharp reflections, not stars === */}
        <g>
          <circle cx="408" cy="247" r="1.5" fill="rgba(255,255,255,0.88)" filter="url(#glintBlur)" className="membrane-glint" />
          <circle cx="758" cy="160" r="1.4" fill="rgba(255,255,255,0.88)" filter="url(#glintBlur)" className="membrane-glint" style={{ animationDelay: '-3s' }} />
          <circle cx="1082" cy="225" r="1.2" fill="rgba(255,255,255,0.88)" filter="url(#glintBlur)" className="membrane-glint" style={{ animationDelay: '-6s' }} />
          <circle cx="1278" cy="223" r="1.35" fill="rgba(255,255,255,0.88)" filter="url(#glintBlur)" className="membrane-glint" style={{ animationDelay: '-9s' }} />
        </g>
      </g>

      <style>{`
        .membrane-highlight {
          fill: none;
          stroke: rgba(255,255,255,0.46);
          stroke-width: 0.7;
          stroke-linecap: round;
          stroke-dasharray: 65 650;
          animation: membraneShimmer 18s ease-in-out infinite;
        }
        .membrane-glint {
          animation: membraneGlintPulse 9s ease-in-out infinite;
        }
        @keyframes membraneShimmer {
          0% { stroke-dashoffset: 700; opacity: 0.16; }
          45% { opacity: 0.64; }
          100% { stroke-dashoffset: -120; opacity: 0.18; }
        }
        @keyframes membraneGlintPulse {
          0%, 100% { opacity: 0.18; transform: scale(0.7); }
          45% { opacity: 0.75; transform: scale(1); }
        }
      `}</style>
    </svg>
  )
}
