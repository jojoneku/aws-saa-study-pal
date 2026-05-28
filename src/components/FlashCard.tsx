"use client"

import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Check, RotateCcw, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Flashcard, CATEGORY_LABELS, DOMAIN_NAMES } from "@/data/flashcards"

// ─── Domain colour map ────────────────────────────────────────────────────────

const DOMAIN_COLORS = {
  1: {
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/10",
    bar: "bg-amber-400",
  },
  2: {
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    dot: "bg-blue-400",
    glow: "shadow-blue-500/10",
    bar: "bg-blue-400",
  },
  3: {
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    dot: "bg-purple-400",
    glow: "shadow-purple-500/10",
    bar: "bg-purple-400",
  },
  4: {
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
    bar: "bg-emerald-400",
  },
} as const

const CATEGORY_COLORS: Record<Flashcard["category"], string> = {
  service: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  concept: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  comparison: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  number: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  trap: "bg-red-500/20 text-red-300 border-red-500/30",
}

// ─── Difficulty dots ──────────────────────────────────────────────────────────

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty ${level} of 3`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full transition-colors",
            i < level ? "bg-white/70" : "bg-white/15"
          )}
        />
      ))}
    </div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FlashCardProps {
  card: Flashcard
  isFlipped: boolean
  onFlip: () => void
  onKnown: () => void
  onStudyMore: () => void
  onPrev: () => void
  onNext: () => void
  currentIndex: number
  totalCards: number
  knownCount: number
  showHint: boolean
  onToggleHint: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FlashCard({
  card,
  isFlipped,
  onFlip,
  onKnown,
  onStudyMore,
  onPrev,
  onNext,
  currentIndex,
  totalCards,
  knownCount,
  showHint,
  onToggleHint,
}: FlashCardProps) {
  const colors = DOMAIN_COLORS[card.domain]
  const cardRef = useRef<HTMLDivElement>(null)

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't fire when typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault()
          onFlip()
          break
        case "ArrowLeft":
          e.preventDefault()
          onPrev()
          break
        case "ArrowRight":
          e.preventDefault()
          onNext()
          break
        case "k":
        case "K":
          if (isFlipped) onKnown()
          break
        case "s":
        case "S":
          if (isFlipped) onStudyMore()
          break
        case "h":
        case "H":
          if (card.hint) onToggleHint()
          break
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isFlipped, onFlip, onKnown, onStudyMore, onPrev, onNext, onToggleHint, card.hint])

  // ── Progress ────────────────────────────────────────────────────────────────
  const progressPct = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">

      {/* ── Header row: domain badge + progress ── */}
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Domain badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              colors.badge
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
            Domain {card.domain}
          </span>

          {/* Category badge */}
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              CATEGORY_COLORS[card.category]
            )}
          >
            {CATEGORY_LABELS[card.category]}
          </span>

          {/* Difficulty */}
          <DifficultyDots level={card.difficulty} />
        </div>

        {/* Counter */}
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="w-full">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{knownCount} known</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", colors.bar)}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Flip card ── */}
      {/*
        CSS 3D flip:
        - perspective on outer wrapper
        - inner div uses transform-style: preserve-3d + transition
        - front face: no transform
        - back face: rotateY(180deg) + backface-visibility hidden
      */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Card answer — click to flip back" : "Card question — click to reveal answer"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onFlip()
          }
        }}
      >
        <div
          ref={cardRef}
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "280px",
          }}
        >
          {/* Front face */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col rounded-2xl border border-white/10 bg-card p-6 shadow-2xl",
              colors.glow
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* "Question" label */}
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Question
            </div>

            {/* Question text */}
            <div className="flex flex-1 items-center justify-center">
              <p className="text-center text-lg font-medium leading-snug text-white sm:text-xl">
                {card.front}
              </p>
            </div>

            {/* Hint row */}
            <div className="mt-4 flex items-center justify-between">
              {card.hint ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleHint()
                  }}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-amber-300/70 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                  aria-label="Toggle hint"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {showHint ? "Hide hint" : "Hint (H)"}
                </button>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground/60 select-none">
                Space / click to flip
              </span>
            </div>

            {/* Hint text */}
            {showHint && card.hint && (
              <div
                className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-300"
                onClick={(e) => e.stopPropagation()}
              >
                {card.hint}
              </div>
            )}
          </div>

          {/* Back face */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col rounded-2xl border border-white/10 bg-card p-6 shadow-2xl",
              colors.glow
            )}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* "Answer" label */}
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Answer
            </div>

            {/* Answer text */}
            <div className="flex flex-1 items-start justify-start overflow-y-auto">
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/90 sm:text-base">
                {card.back}
              </p>
            </div>

            {/* Tags row */}
            {card.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded px-1.5 py-0.5 text-xs font-medium bg-white/5 text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Action buttons (only when flipped) ── */}
      <div
        className={cn(
          "flex w-full items-center gap-3 transition-opacity duration-300",
          isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={onStudyMore}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/20 hover:border-rose-500/50 active:translate-y-px"
          aria-label="Mark as study more (S)"
        >
          <RotateCcw className="h-4 w-4" />
          Study More
          <kbd className="ml-1 hidden rounded bg-white/10 px-1 py-0.5 text-[10px] text-white/40 sm:inline">
            S
          </kbd>
        </button>

        <button
          onClick={onKnown}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 hover:border-emerald-500/50 active:translate-y-px"
          aria-label="Mark as known (K)"
        >
          <Check className="h-4 w-4" />
          Got It
          <kbd className="ml-1 hidden rounded bg-white/10 px-1 py-0.5 text-[10px] text-white/40 sm:inline">
            K
          </kbd>
        </button>
      </div>

      {/* ── Prev / Next navigation ── */}
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          aria-label="Previous card (←)"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {/* Domain name pill */}
        <span className="hidden text-xs text-muted-foreground sm:block truncate max-w-[200px] text-center">
          {DOMAIN_NAMES[card.domain]}
        </span>

        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          aria-label="Next card (→)"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Keyboard hint strip ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground/50">
        <span><kbd className="rounded bg-white/8 px-1">Space</kbd> flip</span>
        <span><kbd className="rounded bg-white/8 px-1">←</kbd><kbd className="rounded bg-white/8 px-1">→</kbd> navigate</span>
        <span><kbd className="rounded bg-white/8 px-1">K</kbd> known</span>
        <span><kbd className="rounded bg-white/8 px-1">S</kbd> study more</span>
        {card.hint && <span><kbd className="rounded bg-white/8 px-1">H</kbd> hint</span>}
      </div>
    </div>
  )
}
