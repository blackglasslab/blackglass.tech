# Blackglass Voice Drop — Product Spec

**Status:** Pre-build / design phase  
**Version:** v0.1 (MVP)  

---

## What it is

A local-first desktop utility that turns messy spoken thoughts into usable text. It is not a generic transcription app. The differentiator is: voice → transcript → structured output modes → clipboard/Markdown.

## Who it's for

High-context thinkers — scientists, founders, academics, builders, and anyone who thinks better out loud. People whose thoughts do not arrive in neat sentences.

## Core principle

Remove the friction between a passing thought and a usable artifact. The user speaks freely (rambling, half-formed, emotional, scientific) and gets back something shaped for its context of use: an email draft, a meeting note, a task list, a research idea, a diary entry.

---

## MVP v0.1

### Platform

- **Mac-first.** Menu-bar app with global hotkey.

### Recording

- **Local recording** via system audio input (CoreAudio / AVFoundation).
- Record starts on hotkey press, stops on release or second press.
- No cloud dependency for recording or transcription.

### Transcription

- Local transcription using an embedded Whisper variant.
- Candidate backends (choose the easiest to package):
  - [`whisper.cpp`](https://github.com/ggerganov/whisper.cpp) — small binary, no Python runtime, good macOS support
  - [`faster-whisper`](https://github.com/SYSTRAN/faster-whisper) — faster but needs Python/CTranslate2
  - OpenAI Whisper (`whisper` Python package) — easiest prototype, heavier macOS dependency
- **Verdict:** `whisper.cpp` is the right choice for a distributable macOS app. For the CLI prototype, any backend works.

### Output

- Transcript is automatically copied to clipboard.
- Transcript is also saved as a `.md` file in a configurable output folder.
- Filename: `YYYY-MM-DD-HHMMSS-<mode>.md`

### Modes

The user selects an output mode before or after recording (default: `raw transcript`). Each mode applies a light template — no LLM call in v0.1, just formatting/presentation.

| Mode | What it does |
|------|-------------|
| Raw transcript | Unmodified spoken text, timestamped |
| Clean text | Removes filler words (um, uh), splits into readable paragraphs |
| Email | Wraps transcript in an email-like format with subject line and salutation |
| Diary | Adds date header, first-person narrative formatting |
| Meeting notes | Structures as bullet points with a meeting header |
| Tasks | Extracts action-like phrases as checkboxes |
| Research idea | Formats as a structured note: Question, Context, Idea, Next steps |

*(Clean text in v0.1 is basic heuristics — regex-level filler removal and paragraph splitting. Full LLM-powered clean text is Phase 4.)*

### Technical architecture (proposed)

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Global hotkey   │ ──▶ │  Record audio    │ ──▶ │  Transcribe      │
│  (launchd /     │     │  (sox / ffmpeg /  │     │  (whisper.cpp)   │
│   Raycast)       │     │  CoreAudio)       │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Clipboard copy  │ ◀── │  Apply mode      │ ◀── │  Select output   │
│  + save .md      │     │  template        │     │  mode             │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## Implementation phases

### Phase 1: CLI prototype *(current focus)*

Build a command-line tool that does the full pipeline:

```sh
voice-drop record                     # record until Ctrl+C
voice-drop transcribe input.wav       # run whisper, output transcript
voice-drop process input.txt --mode email   # apply mode template
voice-drop run                        # record → transcribe → mode → clipboard + save
```

**Dependencies for Phase 1:**
- `ffmpeg` or `sox` for audio capture
- `whisper.cpp` binary (or Python `whisper`)
- `pbcopy` (macOS clipboard)
- POSIX shell / Python / Rust wrapper

**Milestone:** End-to-end working on one developer machine.

### Phase 2: Raycast / Alfred / Shortcuts wrapper

Wrap the CLI in a launcher extension so the user can trigger it without opening a terminal:

- **Raycast extension:** Script command with hotkey
- **Alfred workflow:** Hotkey → record → select mode → done
- **macOS Shortcut:** For users who prefer that ecosystem

**Milestone:** Usable without a terminal visible.

### Phase 3: Menu-bar app

A proper macOS menu-bar application with a GUI:

- Global hotkey (configurable)
- Mode selector (dropdown or picker)
- Model settings (choose whisper model size)
- Output folder selector
- Recent items list
- Optional: API key field for future LLM cleanup

**Tech options:**
- SwiftUI (native, best macOS integration)
- Tauri (Rust + web frontend, cross-platform potential)
- Electron (heavier, but fast to prototype)

**Recommendation:** SwiftUI for a native feel, or Tauri if cross-platform matters. Skip Electron.

### Phase 4: Optional LLM cleanup

User can optionally supply their own OpenAI or Anthropic API key for:

- Clean-up of messy transcripts
- Better mode formatting (the mode template becomes a prompt)
- Summarization of long recordings
- Named entity extraction (turning "talked to Alex about the NF-kB experiment" into a structured research note)

Transcription remains local regardless.

---

## Design principles

1. **Local-first by default.** Audio never leaves the machine unless the user opts in for LLM cleanup.
2. **Every output is immediately usable.** Copy to clipboard, save as Markdown. No app silo, no proprietary format.
3. **Messy thinking is the target.** Not optimized for perfect dictation. Optimized for rambling, half-formed ideas, emotional processing, scientific notes.
4. **Mode is the differentiator, not the model.** The value is in the structured output, not the transcription quality.
5. **One friction point removed.** The app does one thing and does not accumulate features.

---

## Non-goals (v0.1)

- Real-time streaming transcription
- Multi-language support
- Cloud sync
- Voice commands / AI assistant features
- Mobile app
- Windows / Linux (deferred)
- Multiple recording devices / bluetooth headset optimisation

---

## Open questions

1. **Whisper model size:** Which model to embed? `tiny` (~75 MB) feels fast but quality may be poor. `small` (~460 MB) is a better balance. `base` (~140 MB) is a reasonable default.
2. **CLI language:** Python (fastest to prototype), Rust (best distribution), or Go (easy single binary)? Rust pairs naturally with `whisper.cpp`.
3. **Output directory UX:** Default to `~/Documents/VoiceDrop/`? Configurable via settings or `.env`?
4. **Mode templates:** Should modes be editable by the user (e.g., a local `~/.voice-drop/modes/` directory with template files)?

---

## Brand / naming context

Part of the Blackglass tool suite at `blackglass.tech/tools`. Visual identity follows the blackglass design system: black/white minimal, glass/reflection feel, no startup clichés.

---

*Last updated: 2026-05-04*
