"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  BookOpen,
} from "lucide-react"
import type { SavedSession } from "@/lib/storage"

// ─── Domain config (mirrors landing page) ────────────────────────────────────

const DOMAIN_CONFIG = {
  1: {
    name: "Design Secure Architectures",
    weight: 30,
    icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    border: "border-amber-500/30",
    accuracyColor: "text-amber-300",
    barColor: "bg-amber-400",
  },
  2: {
    name: "Design Resilient Architectures",
    weight: 26,
    icon: <RefreshCw className="h-5 w-5 text-blue-400" />,
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    border: "border-blue-500/30",
    accuracyColor: "text-blue-300",
    barColor: "bg-blue-400",
  },
  3: {
    name: "Design High-Performing Architectures",
    weight: 24,
    icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    border: "border-purple-500/30",
    accuracyColor: "text-purple-300",
    barColor: "bg-purple-400",
  },
  4: {
    name: "Design Cost-Optimized Architectures",
    weight: 20,
    icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    border: "border-emerald-500/30",
    accuracyColor: "text-emerald-300",
    barColor: "bg-emerald-400",
  },
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(pct: number): string {
  if (pct >= 72) return "text-emerald-400"
  if (pct >= 60) return "text-yellow-400"
  return "text-red-400"
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function modeBadgeClass(mode: SavedSession["mode"]): string {
  switch (mode) {
    case "practice":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    case "exam":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30"
    case "weak-area":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
  }
}

function modeLabel(mode: SavedSession["mode"]): string {
  switch (mode) {
    case "practice":
      return "Practice"
    case "exam":
      return "Exam"
    case "weak-area":
      return "Weak Area"
  }
}

function domainLabel(domain: SavedSession["domain"]): string {
  if (domain === "all") return "All Domains"
  return `Domain ${domain}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SavedSession[]>([])
  const [examReadiness, setExamReadiness] = useState(0)
  const [domainStats, setDomainStats] = useState<
    { domain: 1 | 2 | 3 | 4; totalAnswered: number; correct: number; accuracy: number; sessions: number }[]
  >([])

  useEffect(() => {
    import("@/lib/storage").then(({ loadSessions, computeDomainStats, computeExamReadiness }) => {
      const loaded = loadSessions()
      setSessions(loaded)
      setDomainStats(computeDomainStats(loaded))
      setExamReadiness(computeExamReadiness(loaded))
    })
  }, [])

  function handleClear() {
    if (!window.confirm("Clear all session history? This cannot be undone.")) return
    import("@/lib/storage").then(({ clearSessions }) => {
      clearSessions()
      setSessions([])
      setDomainStats([])
      setExamReadiness(0)
    })
  }

  const recentSessions = sessions.slice(0, 10)
  const hasData = sessions.length > 0

  const readinessColor = examReadiness >= 72
    ? "text-emerald-400"
    : examReadiness >= 50
    ? "text-yellow-400"
    : "text-red-400"

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        {/* Back button */}
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
          <Badge className="mb-4 border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1 text-xs font-medium tracking-wide">
            Your Progress
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Study Dashboard
          </h1>
          <p className="mt-3 text-muted-foreground">
            Track your performance across all 4 exam domains
          </p>
        </div>

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {!hasData && (
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-card/50 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">No sessions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete a quiz to see your progress here
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/quiz" />}
              className="bg-blue-600 text-white hover:bg-blue-500 px-6 font-semibold"
            >
              Start a Quiz
            </Button>
          </div>
        )}

        {hasData && (
          <div className="space-y-8">
            {/* ── Exam readiness hero ──────────────────────────────────────── */}
            <Card className="border-white/10">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className={`text-7xl font-black tabular-nums ${readinessColor}`}>
                    {examReadiness}%
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Exam Readiness</p>
                    <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                      Based on your recent quiz performance, weighted by domain exam weight
                    </p>
                  </div>
                  <div className="w-full max-w-xs">
                    <Progress value={examReadiness} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Domain performance grid ──────────────────────────────────── */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Domain Performance</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {([1, 2, 3, 4] as const).map((d) => {
                  const cfg = DOMAIN_CONFIG[d]
                  const stat = domainStats.find((s) => s.domain === d)
                  const accuracy = stat?.accuracy ?? 0
                  const totalAnswered = stat?.totalAnswered ?? 0

                  return (
                    <Card key={d} className={`border ${cfg.border}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {cfg.icon}
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Domain {d}
                            </span>
                          </div>
                          <Badge className={`shrink-0 border text-xs font-bold ${cfg.badge}`}>
                            {cfg.weight}%
                          </Badge>
                        </div>
                        <CardTitle className="mt-1 text-sm font-medium text-white/80">
                          {cfg.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4 pt-0">
                        <div className="mb-2 flex items-baseline justify-between">
                          <span className={`text-2xl font-bold ${cfg.accuracyColor}`}>
                            {accuracy}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {totalAnswered} questions answered
                          </span>
                        </div>
                        {/* Thin accuracy progress bar */}
                        <div className="h-1.5 w-full rounded-full bg-white/10">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${cfg.barColor}`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* ── Recent sessions ──────────────────────────────────────────── */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Recent Sessions</h2>
              <Card className="border-white/10">
                <CardContent className="px-0 py-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Mode</th>
                          <th className="px-4 py-3 font-medium">Domain</th>
                          <th className="px-4 py-3 font-medium text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-white/[0.02]">
                            <td className="whitespace-nowrap px-4 py-3 text-white/70">
                              {formatDate(session.completedAt)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={`border text-xs ${modeBadgeClass(session.mode)}`}
                              >
                                {modeLabel(session.mode)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-white/70">
                              {domainLabel(session.domain)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-semibold ${scoreColor(session.scorePercent)}`}>
                                {session.correctAnswers}/{session.totalQuestions} · {session.scorePercent}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Clear history ────────────────────────────────────────────── */}
            <div className="flex justify-center pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              >
                Clear All History
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
