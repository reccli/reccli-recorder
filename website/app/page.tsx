'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Brain, FileText, Search, FolderTree, Save, Zap, GitBranch } from 'lucide-react'

export default function Home() {
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedMcp, setCopiedMcp] = useState(false)
  const [terminalRecordingStarted, setTerminalRecordingStarted] = useState(false)
  const [showWaitlistForm, setShowWaitlistForm] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistError, setWaitlistError] = useState('')
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const stage1Ref = useRef<HTMLDivElement | null>(null)
  const stage2Ref = useRef<HTMLDivElement | null>(null)
  const stage3Ref = useRef<HTMLDivElement | null>(null)
  const slotReelRef = useRef<HTMLDivElement | null>(null)
  const tStemRef = useRef<HTMLSpanElement | null>(null)
  const tBarRef = useRef<HTMLSpanElement | null>(null)
  const deployCardRef = useRef<HTMLSpanElement | null>(null)
  const searchLabelRef = useRef<HTMLSpanElement | null>(null)
  const scanSceneRef = useRef<HTMLDivElement | null>(null)
  const scanBranchesSvgRef = useRef<SVGSVGElement | null>(null)
  const graphSceneRef = useRef<HTMLDivElement | null>(null)
  const [stage1Active, setStage1Active] = useState(false)
  const [stage2Active, setStage2Active] = useState(false)
  const [stage3Active, setStage3Active] = useState(false)

  const sessionList = useMemo(() => {
    const today = new Date()
    const sessions: { name: string; summary: string; selected: boolean; landed: boolean }[] = []
    const summaries = [
      'fixed auth redirect loop',
      'added rate limiting',
      'refactored db queries',
      'updated stripe webhooks',
      'migrated user schema',
      'patched CORS config',
      'added search indexing',
      'fixed session timeout',
      'updated API versioning',
      'added error boundaries',
      'refactored middleware',
      'fixed race condition',
      'updated dependencies',
      'added logging pipeline',
      'fixed memory leak',
      'refactored auth flow',
      'added caching layer',
      'fixed pagination bug',
      'updated test suite',
      'added health checks',
    ]
    // Oldest first (left), today last (right)
    for (let i = 24; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      sessions.push({
        name: `${mm}-${dd}.devsession`,
        summary: summaries[i % summaries.length],
        selected: i === 0,
        landed: i === 20,
      })
    }
    return sessions
  }, [])

  const cloneCommand = 'git clone https://github.com/reccli/reccli.git && cd reccli && pip install -r requirements.txt'
  const mcpCommand = 'claude mcp add reccli -- env PYTHONPATH=packages python3 -m reccli.mcp_server'

  useEffect(() => {
    const stages: [React.RefObject<HTMLDivElement | null>, (v: boolean) => void][] = [
      [stage1Ref, setStage1Active],
      [stage2Ref, setStage2Active],
      [stage3Ref, setStage3Active],
    ]

    const observers: IntersectionObserver[] = []

    stages.forEach(([ref, setActive]) => {
      const node = ref.current
      if (!node) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(true)
            observer.disconnect()
          }
        },
        { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
      )

      observer.observe(node)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Draw tractor beam lines from vertical line to each chip's current position
  useEffect(() => {
    if (!stage1Active) return
    const scene = scanSceneRef.current
    const svg = scanBranchesSvgRef.current
    if (!scene || !svg) return

    const chips = scene.querySelectorAll('.scan-chip')
    const vLine = scene.querySelector('.scan-v-line') as HTMLElement
    if (!vLine || chips.length === 0) return

    const chipFinalYPcts = [0.12, 0.25, 0.38, 0.51, 0.64, 0.77]
    // Line grows bottom-up during 8-28% of 7s = 0.56s to 1.96s
    // Each chip activates when the line reaches its Y (bottom first)
    const animDur = 7 // seconds
    const lineStart = 0.08 * animDur // 0.56s
    const lineEnd = 0.28 * animDur   // 1.96s
    const lineDur = lineEnd - lineStart
    const chipActiveTimes = chipFinalYPcts.map(pct => {
      const progress = 1 - (pct - 0.04) / 0.90 // 0=bottom, 1=top
      return lineStart + progress * lineDur
    })

    const lines: SVGLineElement[] = []
    chips.forEach(() => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('stroke', 'rgba(167, 139, 250, 0.5)')
      line.setAttribute('stroke-width', '2.5')
      line.setAttribute('stroke-linecap', 'round')
      svg.appendChild(line)
      lines.push(line)
    })

    const setViewBox = () => {
      const r = scene.getBoundingClientRect()
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`)
    }
    setViewBox()
    window.addEventListener('resize', setViewBox)

    const startTime = performance.now()
    let rafId: number

    const update = () => {
      const elapsedSec = ((performance.now() - startTime) % (animDur * 1000)) / 1000
      const sceneRect = scene.getBoundingClientRect()
      const vLineRect = vLine.getBoundingClientRect()
      const lineX = vLineRect.left + vLineRect.width / 2 - sceneRect.left

      chips.forEach((chip, i) => {
        const chipRect = chip.getBoundingClientRect()
        const chipLeftX = chipRect.left - sceneRect.left
        const chipCenterY = chipRect.top + chipRect.height / 2 - sceneRect.top
        const finalY = chipFinalYPcts[i] * sceneRect.height + chipRect.height / 2
        const dist = chipLeftX - lineX
        const activated = elapsedSec >= chipActiveTimes[i]

        if (activated && dist > 5) {
          lines[i].setAttribute('x1', String(lineX))
          lines[i].setAttribute('y1', String(finalY))
          lines[i].setAttribute('x2', String(chipLeftX))
          lines[i].setAttribute('y2', String(chipCenterY))
          lines[i].setAttribute('stroke-opacity', String(Math.min(0.55, dist / 60)))
        } else {
          lines[i].setAttribute('stroke-opacity', '0')
        }
      })

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', setViewBox)
      lines.forEach(l => l.remove())
    }
  }, [stage1Active])

  // Drive slot reel animation from JS so landing position is viewport-aware
  useEffect(() => {
    if (!stage2Active) return
    const reel = slotReelRef.current
    if (!reel) return
    const track = reel.parentElement
    if (!track) return

    let currentAnim: Animation | null = null

    const anims: Animation[] = []

    const runAnimation = () => {
      anims.forEach(a => a.cancel())
      anims.length = 0

      const reelWidth = reel.scrollWidth
      const trackWidth = track.clientWidth
      const startX = -(reelWidth - trackWidth)
      const selected = reel.querySelector('.recall-slot-item-landed') as HTMLElement
      if (!selected) return
      const selectedCenter = selected.offsetLeft + selected.offsetWidth / 2
      const endX = -(selectedCenter - trackWidth / 2)
      const dur = 6000

      // Reel scroll
      const reelAnim = reel.animate([
        { transform: `translateX(${startX}px)`, offset: 0 },
        // Smooth x² ease-in / ease-out curve (20 steps)
        ...Array.from({ length: 21 }, (_, i) => {
          const t = i / 20
          const progress = t < 0.5
            ? 2 * t * t
            : 1 - 2 * (1 - t) * (1 - t)
          const x = startX + (endX - startX) * progress
          return { transform: `translateX(${x}px)`, offset: 0.02 + t * 0.21 }
        }),
        { transform: `translateX(${endX}px)`, offset: 0.999 },
        { transform: `translateX(${startX}px)`, offset: 1 },
      ], { duration: dur, easing: 'linear', iterations: Infinity })
      anims.push(reelAnim)

      // T-stem: appears right after reel lands (0.40)
      if (tStemRef.current) {
        anims.push(tStemRef.current.animate([
          { opacity: 0, transform: 'scaleY(0)', offset: 0 },
          { opacity: 0, transform: 'scaleY(0)', offset: 0.22 },
          { opacity: 1, transform: 'scaleY(1)', offset: 0.30 },
          { opacity: 1, transform: 'scaleY(1)', offset: 0.999 },
          { opacity: 0, transform: 'scaleY(0)', offset: 1 },
        ], { duration: dur, easing: 'linear', iterations: Infinity }))
      }

      // T-bar: right after stem (0.46)
      if (tBarRef.current) {
        anims.push(tBarRef.current.animate([
          { opacity: 0, transform: 'scaleX(0)', offset: 0 },
          { opacity: 0, transform: 'scaleX(0)', offset: 0.27 },
          { opacity: 1, transform: 'scaleX(1)', offset: 0.35 },
          { opacity: 1, transform: 'scaleX(1)', offset: 0.999 },
          { opacity: 0, transform: 'scaleX(0)', offset: 1 },
        ], { duration: dur, easing: 'linear', iterations: Infinity }))
      }

      // Search label text swap with scroll animation
      if (searchLabelRef.current) {
        const searching = searchLabelRef.current.querySelector('.recall-label-searching') as HTMLElement
        const found = searchLabelRef.current.querySelector('.recall-label-found') as HTMLElement
        if (searching) {
          anims.push(searching.animate([
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.29 },
            { opacity: 0, offset: 0.30 },
            { opacity: 0, offset: 0.999 },
            { opacity: 1, offset: 1 },
          ], { duration: dur, easing: 'linear', iterations: Infinity }))
        }
        if (found) {
          anims.push(found.animate([
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.29 },
            { opacity: 1, offset: 0.30 },
            { opacity: 1, offset: 0.999 },
            { opacity: 0, offset: 1 },
          ], { duration: dur, easing: 'linear', iterations: Infinity }))
        }
      }

      // Deploy card: right after bar
      if (deployCardRef.current) {
        anims.push(deployCardRef.current.animate([
          { opacity: 0, transform: 'translateY(12px) scale(0.92)', offset: 0 },
          { opacity: 0, transform: 'translateY(12px) scale(0.92)', offset: 0.32 },
          { opacity: 1, transform: 'translateY(0) scale(1)', offset: 0.40 },
          { opacity: 1, transform: 'translateY(0) scale(1)', offset: 0.999 },
          { opacity: 0, transform: 'translateY(12px) scale(0.92)', offset: 1 },
        ], { duration: dur, easing: 'linear', iterations: Infinity }))
      }
    }

    runAnimation()
    window.addEventListener('resize', runAnimation)
    return () => {
      anims.forEach(a => a.cancel())
      window.removeEventListener('resize', runAnimation)
    }
  }, [stage2Active, sessionList])

  // Stage 3: JS-driven graph line draw with proper fade and reset gap
  useEffect(() => {
    if (!stage3Active) return
    const scene = graphSceneRef.current
    if (!scene) return

    const links = scene.querySelectorAll('.graph-link') as NodeListOf<SVGLineElement>
    if (links.length === 0) return

    // Parse each link's --d delay
    const delays = Array.from(links).map(l => {
      const d = getComputedStyle(l).getPropertyValue('--d')
      return parseFloat(d) || 0
    })
    const maxDelay = Math.max(...delays)

    // Timeline: draw (0-2s per link + delays), hold 3s, fade 1s, gap 2s
    const drawDuration = 1.2 // seconds for each line to draw
    const holdAfterAllDrawn = 3
    const fadeDuration = 1
    const gapDuration = 2

    const allDrawnAt = maxDelay + drawDuration
    const fadeStartAt = allDrawnAt + holdAfterAllDrawn
    const fadeEndAt = fadeStartAt + fadeDuration
    const totalCycle = fadeEndAt + gapDuration

    let rafId: number
    const startTime = performance.now()

    const update = () => {
      const elapsed = ((performance.now() - startTime) % (totalCycle * 1000)) / 1000

      links.forEach((link, i) => {
        const delay = delays[i]
        const linkElapsed = elapsed - delay

        if (linkElapsed < 0 || elapsed >= fadeEndAt) {
          // Not started yet or in gap — invisible
          link.style.strokeDashoffset = '1'
          link.style.opacity = '0'
        } else if (linkElapsed < drawDuration) {
          // Drawing
          const progress = linkElapsed / drawDuration
          link.style.strokeDashoffset = String(1 - progress)
          link.style.opacity = String(0.8 * progress)
        } else if (elapsed < fadeStartAt) {
          // Holding — fully drawn
          link.style.strokeDashoffset = '0'
          link.style.opacity = '0.8'
        } else if (elapsed < fadeEndAt) {
          // Fading out
          const fadeProgress = (elapsed - fadeStartAt) / fadeDuration
          link.style.strokeDashoffset = '0'
          link.style.opacity = String(0.8 * (1 - fadeProgress))
        }
      })

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [stage3Active])

  const handleCopy = async (text: string, type: 'install' | 'mcp') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'install') {
        setCopiedInstall(true)
        setTimeout(() => setCopiedInstall(false), 2000)
      } else {
        setCopiedMcp(true)
        setTimeout(() => setCopiedMcp(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTerminalRecordingClick = () => {
    setTerminalRecordingStarted(true)
    setTimeout(() => setTerminalRecordingStarted(false), 2000)
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWaitlistError('')
    setWaitlistLoading(true)

    if (confirmEmail) {
      setTimeout(() => {
        setWaitlistSubmitted(true)
        setWaitlistEmail('')
        setWaitlistLoading(false)
      }, 800)
      return
    }

    try {
      await fetch('https://script.google.com/macros/s/AKfycbx0LLvnKvbf5KVbaDAbgD598RcEYLfn30F3fxGLWAfSyuabvr3k0kQ1IEugprKGmJQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail, confirm_email: confirmEmail }),
      })
      setTimeout(() => {
        setWaitlistSubmitted(true)
        setWaitlistEmail('')
        setWaitlistLoading(false)
      }, 800)
    } catch (error) {
      setWaitlistError('Something went wrong. Please try again.')
      setWaitlistLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white overflow-x-hidden">
      {/* Header */}
      <header className="py-1 bg-gradient-to-r from-[#5b6ef7] to-[#6b5bb8]">
        <nav className="container mx-auto px-6 md:px-10 flex justify-between items-center max-w-7xl pt-2">
          <div className="flex items-center gap-3 text-4xl font-bold tracking-tight">
            <div className="w-5 h-5 bg-[#ff5757] rounded-full"></div>
            reccli
          </div>
          <a
            href="https://github.com/reccli/reccli"
            className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-white/30 transition-all hover:-translate-y-0.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero - Centered, OpenClaw-style */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/datatothought.PNG)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.7,
          }}
        />

        {/* Wave Overlay at Top */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '-35px', zIndex: 20 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full" style={{ display: 'block', height: '100px' }} preserveAspectRatio="none">
            <path
              fill="url(#wave-gradient)"
              fillOpacity="1"
              d="M0,10 L1440,10 L1440,45 C1380,47 1320,49 1260,48 C1200,47 1140,43 1080,44 C1020,45 960,51 900,53 C840,55 780,53 720,50 C660,47 600,43 540,44 C480,45 420,51 360,54 C300,57 240,57 180,55 C120,53 60,49 30,47 L0,45 Z"
            ></path>
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5b6ef7" stopOpacity="1" />
                <stop offset="100%" stopColor="#6b5bb8" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          {/* Brand with dot */}
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tight mb-6 flex items-center gap-4 justify-center">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#ff5757] rounded-full flex-shrink-0"></div>
            reccli
          </h1>

          {/* Tagline + Description */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 mb-12 max-w-xl border border-white/10">
            <p className="text-xl lg:text-2xl font-semibold tracking-wide uppercase text-white/90 mb-3">
              Every session starts informed.
            </p>
            <p className="text-lg lg:text-xl text-white/60 leading-relaxed">
              Persistent memory for AI coding tools.
            </p>
          </div>

          {/* Social buttons */}
          <div className="flex gap-4 mt-10">
            <a
              href="https://github.com/reccli/reccli"
              className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl font-semibold hover:bg-white/25 transition-all inline-flex items-center gap-2"
            >
              Star on GitHub
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=reccli%20-%20persistent%20memory%20for%20AI%20coding%20tools.%20Every%20session%20starts%20informed.&url=https://reccli.com"
              className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-xl font-semibold hover:bg-white/25 transition-all inline-flex items-center gap-2"
            >
              Share
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-10 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><span className="text-white/40">&#10095;</span> Quick Start</h2>
          <p className="text-white/50 mb-8 text-base">Copy and paste the following commands one by one into your terminal <span className="text-white/30">(&#8984; Space: Terminal)</span> to install.</p>
          <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            {/* Terminal header */}
            <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            {/* Commands */}
            <div className="p-6 font-mono text-sm space-y-5">
              <div>
                <div className="text-green-400 mb-2"># Clone and install</div>
                <div
                  onClick={() => handleCopy(cloneCommand, 'install')}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg px-3 py-2 -mx-3 transition-all group relative"
                >
                  <div>
                    <span className="text-white text-base break-all">{cloneCommand}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0 ml-2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {copiedInstall && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg z-10">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-green-400 mb-2"># Add to Claude Code</div>
                <div
                  onClick={() => handleCopy(mcpCommand, 'mcp')}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg px-3 py-2 -mx-3 transition-all group relative"
                >
                  <div>
                    <span className="text-white text-base">{mcpCommand}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {copiedMcp && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg z-10">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
              <div className="text-green-400"># Done. Your AI now has persistent memory.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative overflow-hidden how-it-works-section">
        <div className="container mx-auto px-6 md:px-10 max-w-7xl relative z-10">
          <p className="how-it-works-eyebrow text-center mb-4">How it works</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">Memory that compounds</h2>
          <p className="text-xl text-center opacity-70 mb-14 max-w-2xl mx-auto">Three layers. One command. Every session starts informed.</p>

          <div className="flex flex-col gap-10 lg:gap-14 max-w-6xl mx-auto">

            {/* Stage 1 — Project Scan */}
            <div
              ref={stage1Ref}
              className={`how-stage-row ${stage1Active ? 'is-active' : ''}`}
            >
              <div className="how-stage-scene scan-scene" ref={el => { scanSceneRef.current = el }} aria-hidden="true">
                <span className="scan-v-line"></span>
                <span className="scan-v-label">.devproject</span>
                <span className="scan-status">Project features<br />found</span>
                <span className="scan-beam-v"></span>
                <span className="scan-chip scan-chip-1">auth</span>
                <span className="scan-chip scan-chip-2">payments</span>
                <span className="scan-chip scan-chip-3">api</span>
                <span className="scan-chip scan-chip-4">hooks</span>
                <span className="scan-chip scan-chip-5">chat window</span>
                <span className="scan-chip scan-chip-6">db</span>
                <svg className="scan-branches-svg" ref={el => { scanBranchesSvgRef.current = el }}></svg>
              </div>
              <div className="how-stage-text">
                <span className="how-stage-count">01</span>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">Scan the codebase into structure</h3>
                <p className="text-base lg:text-lg opacity-70 leading-relaxed mb-5">reccli reads your project and builds a <code className="how-code">.devproject</code> feature map — components, dependencies, architecture. Your agent starts with a mental model instead of a blank slate.</p>
                <div className="step-chip-row justify-start">
                  <span className="step-chip">.devproject</span>
                  <span className="step-chip">feature map</span>
                  <span className="step-chip">project structure</span>
                </div>
              </div>
            </div>

            {/* Stage 2 — Session Recall */}
            <div
              ref={stage2Ref}
              className={`how-stage-row how-stage-row-reverse ${stage2Active ? 'is-active' : ''}`}
            >
              <div className="how-stage-scene recall-scene" aria-hidden="true">
                <div className="recall-search-zone">
                  <Search className="recall-search-icon" strokeWidth={1.5} />
                  <span className="recall-search-label" ref={el => { searchLabelRef.current = el }}>
                    <Search className="recall-label-icon" strokeWidth={1.5} />
                    <span className="recall-label-text-wrap">
                      <span className="recall-label-searching">searching...</span>
                      <span className="recall-label-found">exact context retrieval<span className="recall-status-dot"></span></span>
                    </span>
                  </span>
                </div>
                <div className="recall-slot-track">
                  <div className="recall-slot-reel" ref={slotReelRef}>
                    {sessionList.map((s, i) => (
                      <div key={i} className="recall-slot-col">
                        <span className={`recall-slot-item${s.selected ? ' recall-slot-item-selected' : ''}${s.landed ? ' recall-slot-item-landed' : ''}`}><FileText className="recall-slot-icon-outer" strokeWidth={1.7} /><span className="recall-slot-pill">{s.name}</span></span>
                        <span className="recall-slot-summary">{s.summary}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="recall-t-stem" ref={el => { tStemRef.current = el }}></span>
                <span className="recall-t-bar" ref={el => { tBarRef.current = el }}></span>
                <span className="recall-deploy-wrap" ref={el => { deployCardRef.current = el }}>
                  <FileText className="recall-deploy-icon-outer" strokeWidth={1.7} />
                  <span className="recall-deploy-card">
                    decided to keep auth middleware edge-safe, verified session tokens validate before route handlers
                  </span>
                </span>
              </div>
              <div className="how-stage-text">
                <span className="how-stage-count">02</span>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">Reload decisions, not just files</h3>
                <p className="text-base lg:text-lg opacity-70 leading-relaxed mb-5">Prior <code className="how-code">.devsession</code> summaries, open decisions, and working context load automatically. The agent picks up where the last session left off.</p>
                <div className="step-chip-row justify-start">
                  <span className="step-chip">session summaries</span>
                  <span className="step-chip">decisions</span>
                  <span className="step-chip">active context</span>
                </div>
              </div>
            </div>

            {/* Stage 3 — Compounding Knowledge Graph */}
            <div
              ref={stage3Ref}
              className={`how-stage-row ${stage3Active ? 'is-active' : ''}`}
            >
              <div className="how-stage-scene graph-scene" ref={el => { graphSceneRef.current = el }} aria-hidden="true">
                <svg viewBox="0 0 360 270" className="graph-svg" role="presentation">
                  <defs>
                    <radialGradient id="graph-core-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle className="graph-core-glow" cx="180" cy="135" r="35" fill="url(#graph-core-glow)" />
                  <circle className="graph-ripple" cx="180" cy="135" r="20" />
                  <circle className="graph-ripple graph-ripple-2" cx="180" cy="135" r="20" />

                  {/* All lines from center outward — staggered sequentially */}
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0s'} as React.CSSProperties} x1="180" y1="135" x2="192" y2="68" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.15s'} as React.CSSProperties} x1="180" y1="135" x2="238" y2="82" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.08s'} as React.CSSProperties} x1="180" y1="135" x2="248" y2="148" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.25s'} as React.CSSProperties} x1="180" y1="135" x2="225" y2="192" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.12s'} as React.CSSProperties} x1="180" y1="135" x2="132" y2="188" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.32s'} as React.CSSProperties} x1="180" y1="135" x2="112" y2="142" />
                  <line className="graph-link graph-link-r1" pathLength="1" style={{'--d':'0.2s'} as React.CSSProperties} x1="180" y1="135" x2="122" y2="82" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'0.9s'} as React.CSSProperties} x1="180" y1="135" x2="148" y2="32" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.05s'} as React.CSSProperties} x1="180" y1="135" x2="218" y2="38" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.2s'} as React.CSSProperties} x1="180" y1="135" x2="278" y2="52" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'0.95s'} as React.CSSProperties} x1="180" y1="135" x2="285" y2="108" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.4s'} as React.CSSProperties} x1="180" y1="135" x2="295" y2="138" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.25s'} as React.CSSProperties} x1="180" y1="135" x2="275" y2="178" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.55s'} as React.CSSProperties} x1="180" y1="135" x2="258" y2="218" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.1s'} as React.CSSProperties} x1="180" y1="135" x2="198" y2="228" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.7s'} as React.CSSProperties} x1="180" y1="135" x2="158" y2="232" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.35s'} as React.CSSProperties} x1="180" y1="135" x2="95" y2="218" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.85s'} as React.CSSProperties} x1="180" y1="135" x2="65" y2="168" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.5s'} as React.CSSProperties} x1="180" y1="135" x2="62" y2="118" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'2.0s'} as React.CSSProperties} x1="180" y1="135" x2="78" y2="55" />
                  <line className="graph-link graph-link-r2" pathLength="1" style={{'--d':'1.75s'} as React.CSSProperties} x1="180" y1="135" x2="88" y2="92" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'2.6s'} as React.CSSProperties} x1="180" y1="135" x2="128" y2="12" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'2.8s'} as React.CSSProperties} x1="180" y1="135" x2="242" y2="15" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'2.7s'} as React.CSSProperties} x1="180" y1="135" x2="312" y2="35" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'2.95s'} as React.CSSProperties} x1="180" y1="135" x2="328" y2="95" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'2.85s'} as React.CSSProperties} x1="180" y1="135" x2="338" y2="148" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.1s'} as React.CSSProperties} x1="180" y1="135" x2="322" y2="198" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.3s'} as React.CSSProperties} x1="180" y1="135" x2="282" y2="248" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.05s'} as React.CSSProperties} x1="180" y1="135" x2="205" y2="258" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.45s'} as React.CSSProperties} x1="180" y1="135" x2="152" y2="258" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.2s'} as React.CSSProperties} x1="180" y1="135" x2="72" y2="245" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.55s'} as React.CSSProperties} x1="180" y1="135" x2="32" y2="188" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.7s'} as React.CSSProperties} x1="180" y1="135" x2="25" y2="112" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'3.85s'} as React.CSSProperties} x1="180" y1="135" x2="48" y2="30" />
                  <line className="graph-link graph-link-r3" pathLength="1" style={{'--d':'4.0s'} as React.CSSProperties} x1="180" y1="135" x2="38" y2="78" />

                  {/* Core */}
                  <circle className="graph-node graph-node-core" cx="180" cy="135" r="5" />
                  <circle className="graph-node graph-node-core-ring" cx="180" cy="135" r="9" />

                  {/* Scattered dots — randomized positions, no ring symmetry */}
                  {/* Near nodes (larger, labeled) */}
                  <circle className="graph-node graph-node-r1" cx="192" cy="68" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="192" y="58" textAnchor="middle">auth</text>
                  <circle className="graph-node graph-node-r1" cx="238" cy="82" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="252" y="78" textAnchor="start">api</text>
                  <circle className="graph-node graph-node-r1" cx="248" cy="148" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="262" y="152" textAnchor="start">db</text>
                  <circle className="graph-node graph-node-r1" cx="225" cy="192" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="239" y="198" textAnchor="start">routes</text>
                  <circle className="graph-node graph-node-r1" cx="132" cy="188" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="118" y="198" textAnchor="end">hooks</text>
                  <circle className="graph-node graph-node-r1" cx="112" cy="142" r="4.5" />
                  <text className="graph-node-label graph-node-label-r1" x="98" y="146" textAnchor="end">ui</text>
                  <circle className="graph-node graph-node-r1" cx="122" cy="82" r="4.5" />

                  {/* Mid-range dots (medium, some labeled) */}
                  <circle className="graph-node graph-node-r2" cx="148" cy="32" r="3.5" />
                  <text className="graph-node-label graph-node-label-r2" x="133" y="25" textAnchor="end">session 3</text>
                  <circle className="graph-node graph-node-r2" cx="218" cy="38" r="3.5" />
                  <text className="graph-node-label graph-node-label-r2" x="232" y="32" textAnchor="start">session 7</text>
                  <circle className="graph-node graph-node-r2" cx="278" cy="52" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="285" cy="108" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="295" cy="138" r="3.5" />
                  <text className="graph-node-label graph-node-label-r2" x="309" y="142" textAnchor="start">session 12</text>
                  <circle className="graph-node graph-node-r2" cx="275" cy="178" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="258" cy="218" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="198" cy="228" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="158" cy="232" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="95" cy="218" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="65" cy="168" r="3.5" />
                  <text className="graph-node-label graph-node-label-r2" x="51" y="175" textAnchor="end">session 1</text>
                  <circle className="graph-node graph-node-r2" cx="62" cy="118" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="78" cy="55" r="3.5" />
                  <circle className="graph-node graph-node-r2" cx="88" cy="92" r="3.5" />

                  {/* Outer dots (small) */}
                  <circle className="graph-node graph-node-r3" cx="128" cy="12" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="242" cy="15" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="312" cy="35" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="328" cy="95" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="338" cy="148" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="322" cy="198" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="282" cy="248" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="205" cy="258" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="152" cy="258" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="72" cy="245" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="32" cy="188" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="25" cy="112" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="48" cy="30" r="2.8" />
                  <circle className="graph-node graph-node-r3" cx="38" cy="78" r="2.8" />
                </svg>
              </div>
              <div className="how-stage-text">
                <span className="how-stage-count">03</span>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">Memory gets richer over time</h3>
                <p className="text-base lg:text-lg opacity-70 leading-relaxed mb-5">Each session adds to the project&apos;s memory. Structure, decisions, and context accumulate — your agent doesn&apos;t just remember the last session. It learns the project.</p>
                <div className="step-chip-row justify-start">
                  <span className="step-chip">session 1 → session n</span>
                  <span className="step-chip">deeper understanding</span>
                  <span className="step-chip">less re-explaining</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6 md:px-10 max-w-5xl">
          <div className="bg-white/5 backdrop-blur-sm px-4 pt-8 pb-6 md:p-12 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-bold mb-8 text-center">The cold start problem</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-3">
                <div className="text-gray-300 text-lg mb-2">Every session <span className="text-red-300">without reccli</span></div>
                <div className="bg-black/40 px-4 py-4 rounded-xl border border-white/10 font-mono text-sm space-y-1.5">
                  <div className="text-white">"This is a Next.js app with Stripe..."</div>
                  <div className="text-white">"We decided to use Connect because..."</div>
                  <div className="text-white">"The auth middleware is in src/..."</div>
                  <div className="text-white">"Last time we fixed the webhook by..."</div>
                  <div className="text-red-400 mt-3">20 min re-explaining every time</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-gray-300 text-lg mb-2">Session #10 <span className="text-green-300">with reccli</span></div>
                <div className="bg-black/40 px-4 py-4 rounded-xl border border-white/10 font-mono text-sm space-y-1.5">
                  <div className="text-green-400">Project: 8 features, 47 files</div>
                  <div className="text-green-400">Last session: fixed webhook retry</div>
                  <div className="text-green-400">Open issue: transfer error handling</div>
                  <div className="text-green-400">Next step: add idempotency keys</div>
                  <div className="text-green-400 mt-3">Ready to work in 0 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does - dark lifted cards */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-10 max-w-7xl">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-2"><span className="text-white/40">&#10095;</span> What It Does</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <FolderTree className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Project Context</h3>
              <p className="text-sm text-white/60 text-center">Loads your project features, folder tree, and last session summary. Every session starts informed.</p>
            </div>
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <Zap className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Codebase Scan</h3>
              <p className="text-sm text-white/60 text-center">Tree-sitter parses your code, LLM clusters files into features, and creates a structured project map.</p>
            </div>
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-[#ff5757]/40 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <Brain className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Persistent Memory</h3>
              <p className="text-sm text-white/60 text-center">Remembers decisions, problems solved, and next steps across sessions. Your context, always available.</p>
            </div>
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <Search className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Session Search</h3>
              <p className="text-sm text-white/60 text-center">Hybrid search across all past sessions. "What did we decide about auth?" — answered instantly.</p>
            </div>
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <GitBranch className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Exact Context</h3>
              <p className="text-sm text-white/60 text-center">Drill into any result to see the full conversation — exact reasoning chains, not just summaries.</p>
            </div>
            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5">
              <div className="mb-5 flex justify-center">
                <Save className="w-10 h-10 text-[#ff5757]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">Open Format</h3>
              <p className="text-sm text-white/60 text-center">.devsession and .devproject are open specs (CC0). Your data stays local. No lock-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6 md:px-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Open source. Free forever.</h2>
            <p className="text-xl opacity-90">The memory engine is MIT licensed. Team features coming soon.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold border border-green-400/30">
                AVAILABLE NOW
              </div>
              <h3 className="text-3xl font-bold mb-2">Open Source</h3>
              <div className="mb-6">
                <div className="text-5xl font-extrabold">$0</div>
                <div className="text-gray-300 mt-1">forever</div>
              </div>
              <ul className="space-y-3 mb-8 text-lg">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>MCP server for Claude Code, Cursor, Windsurf</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Project init with Tree-sitter codebase scan</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Cross-session memory and search</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Hybrid retrieval (dense + BM25)</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Open .devsession and .devproject formats</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Local storage — your data stays yours</span></li>
              </ul>
              <a href="#get-started" className="block w-full bg-white/20 backdrop-blur-md px-6 py-4 rounded-xl font-bold text-xl hover:bg-white/30 transition-all text-center">
                Install Now
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold border border-orange-400/30">
                COMING SOON
              </div>
              <h3 className="text-3xl font-bold mb-2">Team</h3>
              <div className="mb-6">
                <div className="text-5xl font-extrabold">TBD</div>
                <div className="text-gray-300 mt-1">shared project memory</div>
              </div>
              {!showWaitlistForm ? (
                <>
                  <ul className="space-y-3 mb-8 text-lg">
                    <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Everything in Open Source</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Shared .devsession history across team</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Cross-developer session search</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Team project dashboard</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-400 mt-1">&#10003;</span><span>Hosted memory storage</span></li>
                  </ul>
                  <button onClick={() => setShowWaitlistForm(true)} className="block w-full bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl font-bold text-xl hover:bg-white/15 transition-all text-center">
                    Get Notified
                  </button>
                </>
              ) : (
                <div className="mb-8">
                  {!waitlistSubmitted ? (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                      <p className="text-sm text-gray-300 mb-3">We'll only email you when Team launches. No spam.</p>
                      <input type="email" name="confirm_email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                      <input type="email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                      {waitlistError && <p className="text-red-300 text-sm">{waitlistError}</p>}
                      <button type="submit" disabled={waitlistLoading} className="block w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-6 py-3 rounded-xl font-bold text-lg transition-all border border-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed">
                        {waitlistLoading ? 'Adding you...' : 'Notify Me'}
                      </button>
                      <button type="button" onClick={() => setShowWaitlistForm(false)} className="block w-full text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"><span className="text-green-400 text-3xl">&#10003;</span>You're on the list!</p>
                      <p className="text-gray-300">We'll notify you when Team launches.</p>
                      <button onClick={() => { setShowWaitlistForm(false); setWaitlistSubmitted(false) }} className="mt-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-orange-300 px-6 py-3 rounded-xl font-bold text-lg transition-all border border-orange-500/30">Close</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-20" id="get-started">
        <div className="container mx-auto px-6 md:px-10 max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-12">Get started in 30 seconds</h2>
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-left space-y-8">
            <div>
              <div className="mb-4 text-gray-300"># 1. Clone and install</div>
              <div onClick={() => handleCopy(cloneCommand, 'install')} className="bg-black/20 p-4 rounded-lg cursor-pointer hover:bg-black/30 transition-all relative group flex items-center justify-between">
                <code className="text-base font-mono text-white break-all pr-12">{cloneCommand}</code>
                <button className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>
            <div>
              <div className="mb-4 text-gray-300"># 2. Add to Claude Code (or any MCP-compatible tool)</div>
              <div onClick={() => handleCopy(mcpCommand, 'mcp')} className="bg-black/20 p-4 rounded-lg cursor-pointer hover:bg-black/30 transition-all relative group flex items-center justify-between">
                <code className="text-base font-mono text-white break-all pr-12">{mcpCommand}</code>
                <button className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>
            <div>
              <div className="text-gray-300"># 3. Done. Your AI now has persistent memory.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Under the Hood */}
      <section className="py-16">
        <div className="container mx-auto px-6 md:px-10 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><span className="text-white/40">&#10095;</span> Under the Hood</h2>
          <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Built on temporal-semantic linking</h3>
              <p className="text-white/60">Summaries link back to exact conversations through verifiable provenance, not lossy embeddings. Every decision, problem, and code change traces to the messages that produced it.</p>
            </div>
            <div className="border-t border-white/5 pt-6">
              <h3 className="text-lg font-semibold mb-1">Tri-layer memory architecture</h3>
              <p className="text-white/60"><span className="text-white/80">.devproject</span> (project features) &#8594; <span className="text-white/80">.devsession summary</span> (compacted working memory) &#8594; <span className="text-white/80">.devsession conversation</span> (source of truth). Semantic linking between layers, temporal linking within.</p>
            </div>
            <div className="border-t border-white/5 pt-6">
              <h3 className="text-lg font-semibold mb-1">Hybrid retrieval</h3>
              <p className="text-white/60">Dense embeddings + BM25 sparse search + reciprocal rank fusion. Not just vector similarity — keyword precision when it matters.</p>
            </div>
            <div className="border-t border-white/5 pt-6">
              <h3 className="text-lg font-semibold mb-1">Open formats</h3>
              <p className="text-white/60"><a href="https://github.com/reccli/reccli/blob/main/docs/specs/DEVSESSION_FORMAT.md" className="text-[#ff5757] hover:underline">.devsession</a> and <a href="https://github.com/reccli/reccli/blob/main/docs/specs/DEVPROJECT_FORMAT.md" className="text-[#ff5757] hover:underline">.devproject</a> are CC0-licensed specifications. JSON, human-readable, designed for any tool to implement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            <details className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 group">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center">What tools does reccli work with?<span className="text-2xl group-open:rotate-180 transition-transform ml-2">&#9660;</span></summary>
              <p className="mt-3 text-base opacity-90 leading-relaxed">Any tool that supports MCP (Model Context Protocol). Today that includes Claude Code, Cursor, and Windsurf. The list is growing — MCP is becoming the standard for tool integration.</p>
            </details>
            <details className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 group">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center">Where is my data stored?<span className="text-2xl group-open:rotate-180 transition-transform">&#9660;</span></summary>
              <p className="mt-3 text-base opacity-90 leading-relaxed">Locally on your machine. .devsession and .devproject files live in your project directory. Nothing is uploaded anywhere.</p>
            </details>
            <details className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 group">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center">How is this different from CLAUDE.md?<span className="text-2xl group-open:rotate-180 transition-transform">&#9660;</span></summary>
              <p className="mt-3 text-base opacity-90 leading-relaxed">CLAUDE.md is a static file you maintain by hand. reccli automatically builds a structured project map from your codebase, accumulates session history with searchable decisions and code changes, and loads context dynamically. It's the difference between a sticky note and a database.</p>
            </details>
            <details className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 group">
              <summary className="text-lg font-bold cursor-pointer list-none flex justify-between items-center">Will this always be free?<span className="text-2xl group-open:rotate-180 transition-transform">&#9660;</span></summary>
              <p className="mt-3 text-base opacity-90 leading-relaxed">The core memory engine is MIT licensed and free forever. Future team features (shared memory, cross-developer search, hosted storage) will be a paid product.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="container mx-auto px-10 max-w-7xl text-center">
          <p className="text-white/80 mb-4">&copy; 2024-{new Date().getFullYear()} reccli. Open source memory for AI tools.</p>
          <div className="flex gap-6 justify-center mb-4">
            <a href="mailto:support@reccli.com" className="hover:text-white/60 transition-colors">support@reccli.com</a>
            <a href="https://github.com/reccli/reccli" className="hover:text-white/60 transition-colors">GitHub</a>
          </div>
          <div className="flex gap-6 justify-center text-sm text-white/60">
            <a href="/privacy" className="hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white/80 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
