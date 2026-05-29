"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Layers,
  Shuffle,
  RotateCcw,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FlashCard } from "@/components/FlashCard"
import {
  ALL_FLASHCARDS,
  CATEGORY_LABELS,
  DOMAIN_NAMES,
  CATEGORIES,
  type Flashcard,
} from "@/data/flashcards"

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "drilling" | "complete"

type DomainFilter = 1 | 2 | 3 | 4 | "all"

// ─── Constants ────────────────────────────────────────────────────────────────

const DOMAIN_COLORS = {
  1: {
    border: "border-amber-500/30 hover:border-amber-500/60",
    selectedBorder: "border-amber-500/70",
    bg: "bg-amber-500/10",
    selectedBg: "bg-amber-500/20",
    dot: "bg-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    checkRing: "ring-amber-500/50",
  },
  2: {
    border: "border-blue-500/30 hover:border-blue-500/60",
    selectedBorder: "border-blue-500/70",
    bg: "bg-blue-500/10",
    selectedBg: "bg-blue-500/20",
    dot: "bg-blue-400",
    text: "text-blue-300",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    checkRing: "ring-blue-500/50",
  },
  3: {
    border: "border-purple-500/30 hover:border-purple-500/60",
    selectedBorder: "border-purple-500/70",
    bg: "bg-purple-500/10",
    selectedBg: "bg-purple-500/20",
    dot: "bg-purple-400",
    text: "text-purple-300",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    checkRing: "ring-purple-500/50",
  },
  4: {
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    selectedBorder: "border-emerald-500/70",
    bg: "bg-emerald-500/10",
    selectedBg: "bg-emerald-500/20",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    checkRing: "ring-emerald-500/50",
  },
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Setup Phase ──────────────────────────────────────────────────────────────

interface SetupProps {
  onStart: (deck: Flashcard[]) => void
}

function SetupPhase({ onStart }: SetupProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>("all")
  const [selectedCategories, setSelectedCategories] = useState<
    Set<Flashcard["category"]>
  >(new Set(CATEGORIES))
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<1 | 2 | 3>>(
    new Set([1, 2, 3])
  )
  const [shuffleCards, setShuffleCards] = useState(true)
  const [knownCount, setKnownCount] = useState(0)
  const [studyCount, setStudyCount] = useState(0)

  // Load persisted progress counts for display
  useEffect(() => {
    import("@/lib/storage").then(({ loadFlashcardProgress }) => {
      const p = loadFlashcardProgress()
      setKnownCount(p.knownIds.length)
      setStudyCount(p.studyIds.length)
    })
  }, [])

  function toggleCategory(cat: Flashcard["category"]) {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        if (next.size === 1) return prev // keep at least one
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  function toggleDifficulty(d: 1 | 2 | 3) {
    setSelectedDifficulties((prev) => {
      const next = new Set(prev)
      if (next.has(d)) {
        if (next.size === 1) return prev
        next.delete(d)
      } else {
        next.add(d)
      }
      return next
    })
  }

  const filteredCount = useMemo(() => {
    return ALL_FLASHCARDS.filter(
      (c) =>
        (selectedDomain === "all" || c.domain === selectedDomain) &&
        selectedCategories.has(c.category) &&
        selectedDifficulties.has(c.difficulty)
    ).length
  }, [selectedDomain, selectedCategories, selectedDifficulties])

  function handleStart() {
    let deck = ALL_FLASHCARDS.filter(
      (c) =>
        (selectedDomain === "all" || c.domain === selectedDomain) &&
        selectedCategories.has(c.category) &&
        selectedDifficulties.has(c.difficulty)
    )
    if (shuffleCards) deck = shuffle(deck)
    onStart(deck)
  }

  const domains: { value: DomainFilter; label: string }[] = [
    { value: "all", label: "All Domains" },
    { value: 1, label: "Domain 1 — Security" },
    { value: 2, label: "Domain 2 — Resilient" },
    { value: 3, label: "Domain 3 — High-Performing" },
    { value: 4, label: "Domain 4 — Cost-Optimized" },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      {/* Hero */}
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Layers className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Flashcard Drill</h1>
          <p className="text-sm text-muted-foreground">
            Active recall across {ALL_FLASHCARDS.length} SAA-C03 cards
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Domain picker ── */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Domain
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {domains.map(({ value, label }) => {
              const isSelected = selectedDomain === value
              const dc = value !== "all" ? DOMAIN_COLORS[value] : null
              return (
                <button
                  key={value}
                  onClick={() => setSelectedDomain(value)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-colors text-left",
                    isSelected
                      ? dc
                        ? `${dc.selectedBorder} ${dc.selectedBg} ${dc.text}`
                        : "border-white/30 bg-white/10 text-white"
                      : dc
                      ? `${dc.border} ${dc.bg} text-white/60 hover:text-white/80`
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/8 hover:text-white/80"
                  )}
                >
                  {dc && (
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", dc.dot)} />
                  )}
                  {label}
                  {value !== "all" && (
                    <span className="ml-auto text-xs text-white/30 tabular-nums">
                      {ALL_FLASHCARDS.filter((c) => c.domain === value).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Category filter ── */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isOn = selectedCategories.has(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isOn
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Difficulty filter ── */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Difficulty
          </h2>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((d) => {
              const isOn = selectedDifficulties.has(d)
              const labels = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" }
              return (
                <button
                  key={d}
                  onClick={() => toggleDifficulty(d)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isOn
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"
                  )}
                >
                  <span className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isOn && i < d ? "bg-white/70" : "bg-white/20"
                        )}
                      />
                    ))}
                  </span>
                  {labels[d]}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Options ── */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Options
          </h2>
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setShuffleCards((v) => !v)}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                shuffleCards ? "bg-cyan-500" : "bg-white/20"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  shuffleCards ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </div>
            <span className="flex items-center gap-1.5 text-sm text-white/70">
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle deck
            </span>
          </label>
        </section>

        {/* ── Saved progress banner ── */}
        {(knownCount > 0 || studyCount > 0) && (
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="text-sm text-white/70">
              Saved progress:{" "}
              <span className="text-emerald-400 font-medium">{knownCount} known</span>
              {studyCount > 0 && (
                <>, <span className="text-rose-400 font-medium">{studyCount} to review</span></>
              )}
            </div>
            <button
              onClick={() => {
                import("@/lib/storage").then(({ clearFlashcardProgress }) => {
                  clearFlashcardProgress()
                  setKnownCount(0)
                  setStudyCount(0)
                })
              }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Reset
            </button>
          </div>
        )}

        {/* ── Start button ── */}
        <div className="pt-2">
          <button
            onClick={handleStart}
            disabled={filteredCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-900/30 transition-colors hover:bg-cyan-500 disabled:pointer-events-none disabled:opacity-40"
          >
            Start Drilling
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
              {filteredCount} cards
            </span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Complete Phase ───────────────────────────────────────────────────────────

interface CompleteProps {
  total: number
  known: number
  studyMore: number
  onRestart: () => void
  onSetup: () => void
}

function CompletePhase({ total, known, studyMore, onRestart, onSetup }: CompleteProps) {
  const pct = total > 0 ? Math.round((known / total) * 100) : 0

  const message =
    pct === 100
      ? "Perfect score! You've mastered this deck."
      : pct >= 80
      ? "Excellent! A few cards to polish."
      : pct >= 60
      ? "Good progress — keep drilling the remaining cards."
      : "Keep going! Repetition builds retention."

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-16 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/20">
        <Trophy className="h-9 w-9 text-yellow-400" />
      </div>

      {/* Score */}
      <div>
        <div className="text-6xl font-extrabold text-white tabular-nums">{pct}%</div>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>

      {/* Stats row */}
      <div className="flex w-full divide-x divide-border/50 rounded-xl border border-border/50 bg-card/50">
        <div className="flex flex-1 flex-col items-center py-4">
          <span className="text-2xl font-bold text-emerald-400">{known}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">Got It</span>
        </div>
        <div className="flex flex-1 flex-col items-center py-4">
          <span className="text-2xl font-bold text-rose-400">{studyMore}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">Study More</span>
        </div>
        <div className="flex flex-1 flex-col items-center py-4">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="mt-0.5 text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        {studyMore > 0 && (
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Drill {studyMore} Remaining Cards
          </button>
        )}
        <button
          onClick={onSetup}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          New Session
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/50 hover:text-white/70 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

// ─── Drilling Phase ───────────────────────────────────────────────────────────

interface DrillingProps {
  deck: Flashcard[]
  onComplete: (known: number, studyMore: number) => void
  onSetup: () => void
}

function DrillingPhase({ deck, onComplete, onSetup }: DrillingProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set())
  const [studyMoreIds, setStudyMoreIds] = useState<Set<string>>(new Set())

  // Load persisted progress on mount
  useEffect(() => {
    import("@/lib/storage").then(({ loadFlashcardProgress }) => {
      const saved = loadFlashcardProgress()
      if (saved.knownIds.length > 0 || saved.studyIds.length > 0) {
        setKnownIds(new Set(saved.knownIds))
        setStudyMoreIds(new Set(saved.studyIds))
      }
    })
  }, [])

  const card = deck[currentIndex]

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= deck.length) return
      setCurrentIndex(idx)
      setIsFlipped(false)
      setShowHint(false)
    },
    [deck.length]
  )

  const handleFlip = useCallback(() => {
    setIsFlipped((v) => !v)
    setShowHint(false)
  }, [])

  const handleKnown = useCallback(() => {
    const newKnown = new Set([...knownIds, card.id])
    const newStudyMore = new Set(studyMoreIds)
    newStudyMore.delete(card.id)
    setKnownIds(newKnown)
    setStudyMoreIds(newStudyMore)
    // Persist
    import("@/lib/storage").then(({ saveFlashcardProgress }) => {
      saveFlashcardProgress({ knownIds: [...newKnown], studyIds: [...newStudyMore], lastUpdated: Date.now() })
    })
    if (currentIndex < deck.length - 1) {
      goTo(currentIndex + 1)
    } else {
      onComplete(newKnown.size, newStudyMore.size)
    }
  }, [card.id, currentIndex, deck.length, goTo, knownIds, studyMoreIds, onComplete])

  const handleStudyMore = useCallback(() => {
    const newStudyMore = new Set([...studyMoreIds, card.id])
    const newKnown = new Set(knownIds)
    newKnown.delete(card.id)
    setStudyMoreIds(newStudyMore)
    setKnownIds(newKnown)
    // Persist
    import("@/lib/storage").then(({ saveFlashcardProgress }) => {
      saveFlashcardProgress({ knownIds: [...newKnown], studyIds: [...newStudyMore], lastUpdated: Date.now() })
    })
    if (currentIndex < deck.length - 1) {
      goTo(currentIndex + 1)
    } else {
      onComplete(newKnown.size, newStudyMore.size)
    }
  }, [card.id, currentIndex, deck.length, goTo, knownIds, studyMoreIds, onComplete])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <button
          onClick={onSetup}
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Setup
        </button>
        <div className="flex items-center gap-1.5 text-sm font-medium text-white/70">
          <Layers className="h-4 w-4 text-cyan-400" />
          Flashcard Drill
        </div>
        <div className="w-16 text-right text-xs text-muted-foreground tabular-nums">
          {currentIndex + 1}/{deck.length}
        </div>
      </div>

      {/* Card area */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <FlashCard
          card={card}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onKnown={handleKnown}
          onStudyMore={handleStudyMore}
          onPrev={() => goTo(currentIndex - 1)}
          onNext={() => goTo(currentIndex + 1)}
          currentIndex={currentIndex}
          totalCards={deck.length}
          knownCount={knownIds.size}
          showHint={showHint}
          onToggleHint={() => setShowHint((v) => !v)}
        />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlashcardsPage() {
  const [phase, setPhase] = useState<Phase>("setup")
  const [deck, setDeck] = useState<Flashcard[]>([])
  const [finalKnown, setFinalKnown] = useState(0)
  const [finalStudyMore, setFinalStudyMore] = useState(0)

  function handleStart(newDeck: Flashcard[]) {
    setDeck(newDeck)
    setFinalKnown(0)
    setFinalStudyMore(0)
    setPhase("drilling")
  }

  function handleComplete(known: number, studyMore: number) {
    setFinalKnown(known)
    setFinalStudyMore(studyMore)
    setPhase("complete")
  }

  function handleRestartStudyMore() {
    // Re-shuffle the same deck so the user drills the cards again
    const reshuffled = shuffle(deck)
    setDeck(reshuffled)
    setFinalKnown(0)
    setFinalStudyMore(0)
    setPhase("drilling")
  }

  if (phase === "drilling" && deck.length > 0) {
    return (
      <DrillingPhase
        deck={deck}
        onComplete={handleComplete}
        onSetup={() => setPhase("setup")}
      />
    )
  }

  if (phase === "complete") {
    return (
      <main className="flex-1 bg-background text-foreground">
        <CompletePhase
          total={deck.length}
          known={finalKnown}
          studyMore={finalStudyMore}
          onRestart={handleRestartStudyMore}
          onSetup={() => setPhase("setup")}
        />
      </main>
    )
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <SetupPhase onStart={handleStart} />
    </main>
  )
}
