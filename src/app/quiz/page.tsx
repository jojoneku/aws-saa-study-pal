"use client"

import { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Zap,
  Clock,
  BookOpen,
  ChevronLeft,
  Target,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Domain config ────────────────────────────────────────────────────────────

const domains = [
  {
    value: "all" as const,
    label: "All Domains",
    description: "Mix of questions from all 4 domains",
    icon: <Layers className="h-5 w-5 text-white/60" />,
    color: {
      card: "border-white/10 hover:border-white/25",
      badge: "bg-white/10 text-white/70 border-white/20",
      selected: "border-white/40 bg-white/5 ring-1 ring-white/20",
    },
  },
  {
    value: "cross" as const,
    label: "Cross-Domain",
    sublabel: "Multi-Domain Scenarios",
    description: "Scenarios spanning 2–4 domains at once · hardest",
    icon: <Target className="h-5 w-5 text-pink-400" />,
    color: {
      card: "border-pink-500/20 hover:border-pink-500/50",
      badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      selected: "border-pink-400/60 bg-pink-500/10 ring-1 ring-pink-400/30",
    },
  },
  {
    value: 1 as const,
    label: "Domain 1",
    sublabel: "Design Secure Architectures",
    description: "IAM, KMS, VPC, GuardDuty · 30% of exam",
    icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
    color: {
      card: "border-amber-500/20 hover:border-amber-500/50",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      selected: "border-amber-400/60 bg-amber-500/10 ring-1 ring-amber-400/30",
    },
  },
  {
    value: 2 as const,
    label: "Domain 2",
    sublabel: "Design Resilient Architectures",
    description: "Route 53, RDS Multi-AZ, SQS, Auto Scaling · 26%",
    icon: <RefreshCw className="h-5 w-5 text-blue-400" />,
    color: {
      card: "border-blue-500/20 hover:border-blue-500/50",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      selected: "border-blue-400/60 bg-blue-500/10 ring-1 ring-blue-400/30",
    },
  },
  {
    value: 3 as const,
    label: "Domain 3",
    sublabel: "Design High-Performing Architectures",
    description: "ElastiCache, CloudFront, EBS, Kinesis · 24%",
    icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
    color: {
      card: "border-purple-500/20 hover:border-purple-500/50",
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      selected: "border-purple-400/60 bg-purple-500/10 ring-1 ring-purple-400/30",
    },
  },
  {
    value: 4 as const,
    label: "Domain 4",
    sublabel: "Design Cost-Optimized Architectures",
    description: "Savings Plans, S3 Lifecycle, Spot, Trusted Advisor · 20%",
    icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
    color: {
      card: "border-emerald-500/20 hover:border-emerald-500/50",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      selected: "border-emerald-400/60 bg-emerald-500/10 ring-1 ring-emerald-400/30",
    },
  },
]

// ─── Mode config ──────────────────────────────────────────────────────────────

const modes = [
  {
    value: "practice" as const,
    label: "Practice Mode",
    description: "10 questions · Immediate feedback after each answer",
    icon: <BookOpen className="h-6 w-6 text-blue-400" />,
    badge: "10 questions",
    color: {
      card: "border-blue-500/20 hover:border-blue-500/50",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      selected: "border-blue-400/60 bg-blue-500/10 ring-1 ring-blue-400/30",
    },
  },
  {
    value: "exam" as const,
    label: "Exam Simulation",
    description: "65 questions · 130 min timer · Results revealed at end",
    icon: <Clock className="h-6 w-6 text-rose-400" />,
    badge: "65 questions",
    color: {
      card: "border-rose-500/20 hover:border-rose-500/50",
      badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      selected: "border-rose-400/60 bg-rose-500/10 ring-1 ring-rose-400/30",
    },
  },
  {
    value: "weak-area" as const,
    label: "Weak Area Focus",
    description: "10 questions · Targets your lowest-scoring domains",
    icon: <Target className="h-6 w-6 text-amber-400" />,
    badge: "Adaptive",
    color: {
      card: "border-amber-500/20 hover:border-amber-500/50",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      selected: "border-amber-400/60 bg-amber-500/10 ring-1 ring-amber-400/30",
    },
  },
]

// ─── Difficulty config ────────────────────────────────────────────────────────

const difficulties = [
  {
    value: "mixed" as const,
    label: "Mixed",
    description: "All difficulty levels",
    icon: <Zap className="h-4 w-4 text-white/50" />,
  },
  {
    value: "medium" as const,
    label: "Medium Only",
    description: "Difficulty 3 questions",
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
  },
  {
    value: "hard" as const,
    label: "Hard Only",
    description: "Difficulty 4–5 questions",
    icon: <Zap className="h-4 w-4 text-red-400" />,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

function QuizSetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pre-select domain if navigated here from the landing page with ?domain=X
  const initialDomain = searchParams.get("domain")
  const parsedDomain: "all" | "cross" | 1 | 2 | 3 | 4 =
    initialDomain === "cross"
      ? "cross"
      : initialDomain
      ? (parseInt(initialDomain, 10) as 1 | 2 | 3 | 4)
      : "all"

  const [selectedDomain, setSelectedDomain] = useState<
    "all" | "cross" | 1 | 2 | 3 | 4
  >(parsedDomain)
  const [selectedMode, setSelectedMode] = useState<
    "practice" | "exam" | "weak-area"
  >("practice")
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "mixed" | "medium" | "hard"
  >("mixed")

  // Load last-used preferences from localStorage (only if no ?domain= in URL)
  useEffect(() => {
    if (initialDomain) return // URL param takes priority
    import("@/lib/storage").then(({ loadQuizPreferences }) => {
      const prefs = loadQuizPreferences()
      if (!prefs) return
      setSelectedDomain(prefs.domain)
      setSelectedMode(prefs.mode)
      setSelectedDifficulty(prefs.difficulty)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStart() {
    // Save preferences before navigating
    import("@/lib/storage").then(({ saveQuizPreferences }) => {
      saveQuizPreferences({ domain: selectedDomain, mode: selectedMode, difficulty: selectedDifficulty })
    })
    const params = new URLSearchParams({
      domain: String(selectedDomain),
      mode: selectedMode,
      difficulty: selectedDifficulty,
    })
    router.push(`/quiz/session?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden"
      >
        <div className="h-[600px] w-[800px] rounded-full bg-blue-600/8 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
            className="gap-1.5 text-muted-foreground hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <Badge className="mb-4 border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1 text-xs tracking-wide">
            SAA-C03 Exam Prep
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Start a Quiz
          </h1>
          <p className="mt-3 text-muted-foreground">
            Choose your domain, mode, and difficulty to begin
          </p>
        </div>

        <div className="space-y-8">
          {/* ── Domain selection ─────────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                1
              </span>
              Select Domain
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((d) => {
                const isSelected = selectedDomain === d.value
                return (
                  <button
                    key={String(d.value)}
                    type="button"
                    onClick={() => setSelectedDomain(d.value)}
                    className={cn(
                      "group/domain rounded-xl border bg-card px-4 py-4 text-left transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isSelected ? d.color.selected : d.color.card
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {d.icon}
                        <span className="text-sm font-semibold text-white">
                          {d.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    {d.sublabel && (
                      <p className="mt-1.5 text-xs font-medium text-white/80">
                        {d.sublabel}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {d.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Mode selection ───────────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                2
              </span>
              Select Mode
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {modes.map((m) => {
                const isSelected = selectedMode === m.value
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMode(m.value)}
                    className={cn(
                      "rounded-xl border bg-card px-4 py-5 text-left transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isSelected ? m.color.selected : m.color.card
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                        {m.icon}
                      </div>
                      {isSelected && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {m.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                    <Badge
                      className={cn(
                        "mt-3 border text-[10px] font-semibold",
                        m.color.badge
                      )}
                    >
                      {m.badge}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Difficulty selection ─────────────────────────────────────── */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                3
              </span>
              Difficulty Filter
            </h2>
            <div className="flex flex-wrap gap-3">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff.value
                return (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-medium transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      isSelected
                        ? "border-white/40 bg-white/8 text-white ring-1 ring-white/20"
                        : "border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                    )}
                  >
                    {diff.icon}
                    <span>{diff.label}</span>
                    <span className="text-xs text-muted-foreground">
                      — {diff.description}
                    </span>
                    {isSelected && (
                      <span className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Summary + Start ──────────────────────────────────────────── */}
          <Card className="border-white/10 bg-card/80">
            <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Ready to start?</p>
                <p className="text-xs text-muted-foreground">
                  {domains.find((d) => d.value === selectedDomain)?.label} ·{" "}
                  {modes.find((m) => m.value === selectedMode)?.label} ·{" "}
                  {difficulties.find((d) => d.value === selectedDifficulty)?.label} difficulty
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleStart}
                className="bg-blue-600 text-white hover:bg-blue-500 px-8 font-semibold shadow-lg shadow-blue-900/30"
              >
                Start Quiz →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function QuizSetupPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </main>
    }>
      <QuizSetupContent />
    </Suspense>
  )
}
