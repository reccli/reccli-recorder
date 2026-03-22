'use client'

import { useState } from 'react'
import { Brain, Search, FolderTree, Save, Zap, GitBranch } from 'lucide-react'

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

  const installCommand = 'pip install reccli'
  const mcpCommand = 'claude mcp add reccli -- python -m reccli.mcp_server'

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
              <br />
              Works with Claude Code, Cursor, and Windsurf.
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
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><span className="text-white/40">&#10095;</span> Quick Start</h2>
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
                <div className="text-green-400 mb-2"># Install reccli</div>
                <div
                  onClick={() => handleCopy(installCommand, 'install')}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg px-3 py-2 -mx-3 transition-all group relative"
                >
                  <div>
                    <span className="text-green-400">$</span>
                    <span className="text-white ml-2 text-base">{installCommand}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0">
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
                <div className="text-green-400 mb-2"># Add to Claude Code (or any MCP-compatible tool)</div>
                <div
                  onClick={() => handleCopy(mcpCommand, 'mcp')}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg px-3 py-2 -mx-3 transition-all group relative"
                >
                  <div>
                    <span className="text-green-400">$</span>
                    <span className="text-white ml-2 text-base">{mcpCommand}</span>
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
          <p className="text-center text-sm text-white/50 mt-4">Works with Claude Code, Cursor, Windsurf, and any MCP-compatible tool.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-10 max-w-7xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">How it works</h2>
          <p className="text-xl text-center opacity-70 mb-16 max-w-2xl mx-auto">Two commands. Then your AI remembers everything.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
              <div className="text-5xl font-bold text-white/20 mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">First session</h3>
              <p className="text-lg opacity-90">reccli scans your codebase with Tree-sitter, clusters files into features, and creates a structured project map.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
              <div className="text-5xl font-bold text-white/20 mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Every session after</h3>
              <p className="text-lg opacity-90">Your AI loads the project map + last session's decisions, problems solved, and next steps. No re-explaining.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 text-center">
              <div className="text-5xl font-bold text-white/20 mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">It compounds</h3>
              <p className="text-lg opacity-90">Session #10 is dramatically better than #1. Your AI accumulates structured memory instead of starting cold.</p>
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
              <div className="mb-4 text-gray-300"># 1. Install reccli</div>
              <div onClick={() => handleCopy(installCommand, 'install')} className="bg-black/20 p-4 rounded-lg cursor-pointer hover:bg-black/30 transition-all relative group flex items-center justify-between">
                <code className="text-xl font-mono text-white break-all pr-12">{installCommand}</code>
                <button className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>
            <div>
              <div className="mb-4 text-gray-300"># 2. Add to Claude Code (or any MCP-compatible tool)</div>
              <div onClick={() => handleCopy(mcpCommand, 'mcp')} className="bg-black/20 p-4 rounded-lg cursor-pointer hover:bg-black/30 transition-all relative group flex items-center justify-between">
                <code className="text-lg font-mono text-white break-all pr-12">{mcpCommand}</code>
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
