"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { OptionButton } from "@/components/OptionButton"
import type { Question, Domain } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronLeft,
  Target,
} from "lucide-react"

// ─── Mock questions fallback ──────────────────────────────────────────────────

const MOCK_QUESTIONS: Question[] = [
  {
    id: "mock-1",
    domain: 1,
    taskStatement: "1.1",
    services: ["iam", "s3"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A company needs to grant an EC2 instance access to an S3 bucket without storing credentials on the instance. What is the MOST secure approach?",
    options: [
      {
        id: "A",
        text: "Store AWS access keys in environment variables on the EC2 instance",
        isCorrect: false,
        explanation:
          "Storing credentials on instances is an anti-pattern — they can be leaked via metadata or logs.",
      },
      {
        id: "B",
        text: "Attach an IAM role with an S3 policy to the EC2 instance",
        isCorrect: true,
        explanation:
          "IAM roles provide temporary credentials automatically rotated by AWS — the correct least-privilege approach.",
      },
      {
        id: "C",
        text: "Create an IAM user and store the access key in a config file on the instance",
        isCorrect: false,
        explanation:
          "IAM users with static keys stored on instances are a security risk — roles are always preferred.",
      },
      {
        id: "D",
        text: "Use the root account credentials passed via user data script",
        isCorrect: false,
        explanation:
          "Root account credentials should never be used for application access.",
      },
    ],
    explanation:
      "IAM roles for EC2 instances provide automatically rotated temporary credentials via the instance metadata service. No credentials need to be stored on the instance.",
    keywords: ["most secure", "without storing credentials"],
  },
  {
    id: "mock-2",
    domain: 2,
    taskStatement: "2.2",
    services: ["rds", "multi-az"],
    constraintType: "ha",
    difficulty: 2,
    type: "single",
    stem: "A company runs a MySQL database on RDS and needs automatic failover in case of an Availability Zone outage. Which configuration achieves this with the LEAST operational overhead?",
    options: [
      {
        id: "A",
        text: "Create RDS Read Replicas in multiple Availability Zones",
        isCorrect: false,
        explanation:
          "Read Replicas provide read scaling but require manual promotion — they are not automatic failover.",
      },
      {
        id: "B",
        text: "Enable RDS Multi-AZ deployment",
        isCorrect: true,
        explanation:
          "Multi-AZ maintains a synchronous standby replica with automatic failover — zero operational overhead.",
      },
      {
        id: "C",
        text: "Deploy MySQL on EC2 instances in multiple AZs with a custom failover script",
        isCorrect: false,
        explanation:
          "EC2-based MySQL requires significant operational overhead for failover management.",
      },
      {
        id: "D",
        text: "Use RDS snapshots to restore in another AZ if the primary fails",
        isCorrect: false,
        explanation:
          "Snapshot restore requires manual intervention and results in significant downtime.",
      },
    ],
    explanation:
      "RDS Multi-AZ provides synchronous replication to a standby in another AZ. Failover is automatic (60-120 seconds) with no application changes required.",
    keywords: ["automatic failover", "least operational overhead"],
  },
  {
    id: "mock-3",
    domain: 3,
    taskStatement: "3.1",
    services: ["cloudfront", "s3"],
    constraintType: "performance",
    difficulty: 2,
    type: "single",
    stem: "A company hosts a global web application with static assets stored in S3. Users in Asia report slow load times. What is the MOST effective way to improve performance for these users?",
    options: [
      {
        id: "A",
        text: "Enable S3 Transfer Acceleration on the bucket",
        isCorrect: false,
        explanation:
          "Transfer Acceleration speeds up uploads to S3, not downloads of static content to end users.",
      },
      {
        id: "B",
        text: "Replicate the S3 bucket to a region closer to Asia",
        isCorrect: false,
        explanation:
          "Cross-region replication adds operational complexity and doesn't cache at the edge for all regions.",
      },
      {
        id: "C",
        text: "Distribute the content using Amazon CloudFront with edge locations",
        isCorrect: true,
        explanation:
          "CloudFront caches content at hundreds of edge locations globally, dramatically reducing latency for users worldwide.",
      },
      {
        id: "D",
        text: "Increase the S3 bucket throughput using S3 Intelligent-Tiering",
        isCorrect: false,
        explanation:
          "S3 Intelligent-Tiering manages storage costs, not delivery performance for end users.",
      },
    ],
    explanation:
      "Amazon CloudFront is a CDN that caches content at edge locations close to users. For global static asset delivery, CloudFront is the standard solution to reduce latency.",
    keywords: ["most effective", "improve performance"],
  },
  {
    id: "mock-4",
    domain: 4,
    taskStatement: "4.1",
    services: ["ec2", "spot", "savings-plans"],
    constraintType: "cost",
    difficulty: 3,
    type: "single",
    stem: "A company runs a batch processing workload that can tolerate interruptions and runs for 4 hours each night. The workload currently uses On-Demand EC2 instances. Which pricing option provides the MOST cost savings?",
    options: [
      {
        id: "A",
        text: "Reserved Instances with a 1-year term",
        isCorrect: false,
        explanation:
          "Reserved Instances require a 1 or 3-year commitment and are best for steady-state, always-on workloads.",
      },
      {
        id: "B",
        text: "EC2 Spot Instances",
        isCorrect: true,
        explanation:
          "Spot Instances offer up to 90% discount over On-Demand pricing. Since the batch job can tolerate interruptions, Spot is the most cost-effective option.",
      },
      {
        id: "C",
        text: "Dedicated Hosts",
        isCorrect: false,
        explanation:
          "Dedicated Hosts are the most expensive option and designed for licensing compliance requirements.",
      },
      {
        id: "D",
        text: "Savings Plans with Compute savings",
        isCorrect: false,
        explanation:
          "Savings Plans require a commitment to a consistent compute usage level. For intermittent batch jobs, Spot provides greater savings.",
      },
    ],
    explanation:
      "EC2 Spot Instances are ideal for fault-tolerant, flexible workloads. They offer up to 90% savings vs On-Demand. Since the batch job can tolerate interruptions, Spot is the optimal choice.",
    keywords: ["most cost savings", "can tolerate interruptions"],
  },
  {
    id: "mock-5",
    domain: 1,
    taskStatement: "1.2",
    services: ["vpc", "security-groups", "nacl"],
    constraintType: "security",
    difficulty: 3,
    type: "single",
    stem: "A security team needs to block a specific IP address from accessing all resources in a VPC. Which AWS feature should they use to accomplish this MOST efficiently?",
    options: [
      {
        id: "A",
        text: "Update all Security Groups to deny the IP address",
        isCorrect: false,
        explanation:
          "Security Groups are stateful and only allow rules — they cannot explicitly deny. You would need to update every security group.",
      },
      {
        id: "B",
        text: "Add a DENY rule in the Network ACL (NACL) associated with the subnet",
        isCorrect: true,
        explanation:
          "NACLs are stateless and support explicit DENY rules. A single NACL rule at the subnet level blocks the IP for all resources in that subnet.",
      },
      {
        id: "C",
        text: "Create a WAF rule to block the IP address",
        isCorrect: false,
        explanation:
          "WAF operates at the application layer (Layer 7) and only protects resources behind ALB, API Gateway, or CloudFront — not all VPC resources.",
      },
      {
        id: "D",
        text: "Configure a route table to drop traffic from the IP",
        isCorrect: false,
        explanation:
          "Route tables control routing, not access control based on source IP addresses.",
      },
    ],
    explanation:
      "NACLs operate at the subnet level and support explicit ALLOW and DENY rules. They are the correct tool for blocking specific IPs at the network level across all resources in a subnet.",
    keywords: ["block", "most efficiently"],
  },
]

// ─── Domain helpers ───────────────────────────────────────────────────────────

const DOMAIN_CONFIG = {
  1: {
    label: "Domain 1 – Secure",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    dot: "bg-amber-400",
  },
  2: {
    label: "Domain 2 – Resilient",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    dot: "bg-blue-400",
  },
  3: {
    label: "Domain 3 – High-Performing",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    dot: "bg-purple-400",
  },
  4: {
    label: "Domain 4 – Cost-Optimized",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    dot: "bg-emerald-400",
  },
} as const

function DomainBadge({ domain }: { domain: Domain }) {
  const cfg = DOMAIN_CONFIG[domain]
  return (
    <Badge className={cn("flex items-center gap-1 border text-xs", cfg.badge)}>
      {cfg.icon}
      {cfg.label}
    </Badge>
  )
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            i < level ? "bg-white/70" : "bg-white/15"
          )}
        />
      ))}
    </div>
  )
}

// ─── Timer component ──────────────────────────────────────────────────────────

function ExamTimer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number
  onExpire: () => void
}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire()
      return
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          onExpire()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isLow = secondsLeft < 600 // last 10 min

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold",
        isLow
          ? "border-red-500/40 bg-red-500/10 text-red-300"
          : "border-white/10 bg-white/5 text-white/80"
      )}
    >
      <Clock className={cn("h-3.5 w-3.5", isLow ? "text-red-400" : "text-white/50")} />
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  )
}

// ─── Results screen ───────────────────────────────────────────────────────────

interface ResultsProps {
  questions: Question[]
  answers: Record<string, string>
  onRetry: () => void
}

function ResultsScreen({ questions, answers, onRetry }: ResultsProps) {
  const total = questions.length
  const correct = questions.filter((q) => {
    const answer = answers[q.id]
    return q.options.find((o) => o.id === answer)?.isCorrect === true
  }).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  // Domain breakdown
  const domainBreakdown = ([1, 2, 3, 4] as Domain[]).map((d) => {
    const qs = questions.filter((q) => q.domain === d)
    const vc = qs.filter((q) => {
      const answer = answers[q.id]
      return q.options.find((o) => o.id === answer)?.isCorrect === true
    }).length
    return { domain: d, total: qs.length, correct: vc }
  }).filter((row) => row.total > 0)

  const scoreColor =
    pct >= 72 ? "text-emerald-400" : pct >= 60 ? "text-yellow-400" : "text-red-400"
  const scoreRing =
    pct >= 72
      ? "border-emerald-500/40 bg-emerald-500/10"
      : pct >= 60
      ? "border-yellow-500/40 bg-yellow-500/10"
      : "border-red-500/40 bg-red-500/10"

  return (
    <div className="mx-auto max-w-xl space-y-8">
      {/* Score hero */}
      <Card className={cn("border text-center", scoreRing)}>
        <CardContent className="py-10">
          <div className={cn("text-7xl font-black tabular-nums", scoreColor)}>
            {correct}/{total}
          </div>
          <div className={cn("mt-2 text-2xl font-bold", scoreColor)}>{pct}%</div>
          <p className="mt-3 text-sm text-muted-foreground">
            {pct >= 72
              ? "Excellent! You're on track to pass."
              : pct >= 60
              ? "Getting there — keep reviewing weak areas."
              : "More practice needed — focus on core services."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              AWS passing score: ~72%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Domain breakdown */}
      {domainBreakdown.length > 0 && (
        <Card className="border-white/10">
          <CardHeader className="pb-0">
            <p className="text-sm font-semibold text-white">Domain Breakdown</p>
          </CardHeader>
          <CardContent className="pt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Domain</th>
                  <th className="pb-3 pr-4 font-medium text-right">Score</th>
                  <th className="pb-3 font-medium text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {domainBreakdown.map((row) => {
                  const acc =
                    row.total > 0
                      ? Math.round((row.correct / row.total) * 100)
                      : 0
                  const cfg = DOMAIN_CONFIG[row.domain]
                  const accColor =
                    acc >= 72
                      ? "text-emerald-400"
                      : acc >= 60
                      ? "text-yellow-400"
                      : "text-red-400"
                  return (
                    <tr key={row.domain}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-sm",
                              cfg.badge
                            )}
                          >
                            {cfg.icon}
                          </span>
                          <span className="text-white/80">{cfg.label}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right text-white/80">
                        {row.correct}/{row.total}
                      </td>
                      <td className={cn("py-3 text-right font-semibold", accColor)}>
                        {acc}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onRetry}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-500 font-semibold"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
          className="flex-1 border-white/15 text-white hover:bg-white/5"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}

// ─── Main session page ────────────────────────────────────────────────────────

export default function QuizSessionPage() {
  const searchParams = useSearchParams()

  const domainParam = searchParams.get("domain") ?? "all"
  const modeParam = (searchParams.get("mode") ?? "practice") as
    | "practice"
    | "exam"
    | "weak-area"
  const difficultyParam = (searchParams.get("difficulty") ?? "mixed") as
    | "mixed"
    | "medium"
    | "hard"

  // ── Load and filter questions ──────────────────────────────────────────────
  // Try to import real questions; fall back to mocks
  let allQuestions: Question[] = MOCK_QUESTIONS
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@/data/questions")
    if (Array.isArray(mod.questions) && mod.questions.length > 0) {
      allQuestions = mod.questions
    } else if (Array.isArray(mod.default) && mod.default.length > 0) {
      allQuestions = mod.default
    }
  } catch {
    // data file doesn't exist yet — use mocks
  }

  // Filter by domain
  const domainFiltered =
    domainParam === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.domain === parseInt(domainParam, 10))

  // Filter by difficulty
  const diffFiltered = domainFiltered.filter((q) => {
    if (difficultyParam === "medium") return q.difficulty === 3
    if (difficultyParam === "hard") return q.difficulty >= 4
    return true
  })

  // Shuffle + limit
  const questionCount = modeParam === "exam" ? 65 : 10
  const shuffled = [...(diffFiltered.length > 0 ? diffFiltered : MOCK_QUESTIONS)]
    .sort(() => Math.random() - 0.5)
    .slice(0, questionCount)

  // ── State ─────────────────────────────────────────────────────────────────
  const [questions] = useState<Question[]>(shuffled)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [timerKey] = useState(() => Date.now()) // stable key for timer

  const isPractice = modeParam === "practice"
  const isExam = modeParam === "exam"
  const currentQuestion = questions[currentIndex]
  const progress = currentIndex + 1
  const total = questions.length

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelect = useCallback(
    (optionId: string) => {
      if (revealed) return
      if (isPractice) {
        // In practice: selecting reveals immediately
        setSelectedAnswer(optionId)
        setRevealed(true)
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
      } else {
        // In exam: selecting just highlights, not revealed
        setSelectedAnswer(optionId)
      }
    },
    [revealed, isPractice, currentQuestion?.id]
  )

  const handleNext = useCallback(() => {
    if (!isPractice && selectedAnswer) {
      // Commit exam answer
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }))
    }
    if (currentIndex + 1 >= total) {
      setCompleted(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setRevealed(false)
    }
  }, [isPractice, selectedAnswer, currentIndex, total, currentQuestion?.id])

  const handleTimerExpire = useCallback(() => {
    // Commit any pending answer and show results
    if (selectedAnswer && currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer,
      }))
    }
    setCompleted(true)
  }, [selectedAnswer, currentQuestion])

  const handleRetry = useCallback(() => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setRevealed(false)
    setAnswers({})
    setCompleted(false)
  }, [])

  // ── Keyboard shortcut (A-D to select, Enter/Space for next) ───────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (completed) return
      if (["a", "A"].includes(e.key)) handleSelect("A")
      else if (["b", "B"].includes(e.key)) handleSelect("B")
      else if (["c", "C"].includes(e.key)) handleSelect("C")
      else if (["d", "D"].includes(e.key)) handleSelect("D")
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (isPractice && revealed) handleNext()
        else if (!isPractice && selectedAnswer) handleNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [completed, handleSelect, handleNext, isPractice, revealed, selectedAnswer])

  // ── Guard: no questions ────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <p className="text-white text-lg font-semibold mb-2">No questions found</p>
        <p className="text-muted-foreground text-sm mb-6">
          No questions match your current filters. Try changing the domain or difficulty.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/quiz" />}
          className="bg-blue-600 text-white hover:bg-blue-500"
        >
          Back to Setup
        </Button>
      </main>
    )
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (completed) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden"
        >
          <div className="h-[600px] w-[800px] rounded-full bg-blue-600/8 blur-[140px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/quiz" />}
              className="gap-1.5 text-muted-foreground hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              New Quiz
            </Button>
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white">Quiz Complete</h1>
            <p className="mt-2 text-muted-foreground">Here's how you did</p>
          </div>
          <ResultsScreen
            questions={questions}
            answers={answers}
            onRetry={handleRetry}
          />
        </div>
      </main>
    )
  }

  // ── Quiz in progress ───────────────────────────────────────────────────────
  const keyword = currentQuestion.keywords.find((kw) =>
    currentQuestion.stem.toLowerCase().includes(kw.toLowerCase())
  )

  const correctOption = currentQuestion.options.find((o) => o.isCorrect)
  const selectedOption = currentQuestion.options.find(
    (o) => o.id === selectedAnswer
  )
  const isCorrectAnswer = selectedOption?.isCorrect === true

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden"
      >
        <div className="h-[500px] w-[700px] rounded-full bg-blue-600/7 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/quiz" />}
            className="gap-1 text-muted-foreground hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Setup</span>
          </Button>

          {/* Progress */}
          <div className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Question{" "}
              <span className="text-white">{progress}</span> of{" "}
              <span className="text-white">{total}</span>
            </span>
            {/* Progress bar */}
            <div className="h-1.5 w-full max-w-xs rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer (exam only) */}
          {isExam ? (
            <ExamTimer
              key={timerKey}
              totalSeconds={130 * 60}
              onExpire={handleTimerExpire}
            />
          ) : (
            <div className="w-20" /> /* spacer */
          )}
        </div>

        {/* ── Question card ────────────────────────────────────────────────── */}
        <Card className="border-white/10 bg-card">
          <CardHeader className="pb-0">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <DomainBadge domain={currentQuestion.domain} />
              <DifficultyDots level={currentQuestion.difficulty} />
              <span className="text-xs text-muted-foreground">
                Task {currentQuestion.taskStatement}
              </span>
            </div>

            {/* Keyword badge */}
            {keyword && (
              <div className="mt-3">
                <Badge className="border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-xs px-2.5">
                  🎯 {keyword}
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-4">
            {/* Stem */}
            <p className="text-[15px] leading-relaxed text-white">
              {currentQuestion.stem}
            </p>

            {/* Service tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {currentQuestion.services.map((svc) => (
                <span
                  key={svc}
                  className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/50 uppercase tracking-wide"
                >
                  {svc}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Options ──────────────────────────────────────────────────────── */}
        <div className="mt-4 space-y-2.5">
          {currentQuestion.options.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              selected={selectedAnswer === option.id}
              revealed={revealed}
              onClick={() => handleSelect(option.id)}
            />
          ))}
        </div>

        {/* ── Exam mode: Next button before reveal ─────────────────────────── */}
        {!isPractice && !revealed && (
          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={cn(
                "px-6 font-semibold",
                selectedAnswer
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              {currentIndex + 1 >= total ? "Finish" : "Next Question →"}
            </Button>
          </div>
        )}

        {/* ── Practice mode: Explanation panel ─────────────────────────────── */}
        {isPractice && revealed && (
          <div className="mt-5 space-y-4">
            {/* Verdict banner */}
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3",
                isCorrectAnswer
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-red-500/40 bg-red-500/10"
              )}
            >
              <span className="text-xl">
                {isCorrectAnswer ? "✓" : "✗"}
              </span>
              <div>
                <p
                  className={cn(
                    "font-semibold text-sm",
                    isCorrectAnswer ? "text-emerald-300" : "text-red-300"
                  )}
                >
                  {isCorrectAnswer ? "Correct!" : "Incorrect"}
                  {!isCorrectAnswer && correctOption && (
                    <span className="ml-1 font-normal text-white/70">
                      — correct answer was{" "}
                      <strong className="text-emerald-300">{correctOption.id}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Overall explanation */}
            <Card className="border-white/10 bg-white/[0.03]">
              <CardContent className="py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Explanation
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                {/* Per-option explanations */}
                <div className="mt-4 space-y-2.5">
                  {currentQuestion.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-xs leading-relaxed",
                        opt.isCorrect
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-white/[0.03] text-white/50"
                      )}
                    >
                      <span
                        className={cn(
                          "mr-2 font-bold",
                          opt.isCorrect ? "text-emerald-400" : "text-white/40"
                        )}
                      >
                        {opt.id}.
                      </span>
                      {opt.explanation}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next button */}
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                className="bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500"
              >
                {currentIndex + 1 >= total ? "See Results" : "Next Question →"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Keyboard hint ─────────────────────────────────────────────────── */}
        <p className="mt-6 text-center text-[11px] text-white/20">
          Press A – D to select
          {isPractice && revealed ? " · Enter for next" : !isPractice && selectedAnswer ? " · Enter for next" : ""}
        </p>
      </div>
    </main>
  )
}
