import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Layers,
  Clock,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// ─── Domain data ────────────────────────────────────────────────────────────

const domains = [
  {
    number: 1,
    name: "Design Secure Architectures",
    weight: 30,
    services: ["IAM", "KMS", "VPC", "GuardDuty"],
    color: {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      border: "border-amber-500/30 hover:border-amber-500/60",
      dot: "bg-amber-400",
      icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
      tag: "bg-amber-500/10 text-amber-300",
      button:
        "border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/60",
    },
  },
  {
    number: 2,
    name: "Design Resilient Architectures",
    weight: 26,
    services: ["Route 53", "RDS Multi-AZ", "SQS", "Auto Scaling"],
    color: {
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      border: "border-blue-500/30 hover:border-blue-500/60",
      dot: "bg-blue-400",
      icon: <RefreshCw className="h-5 w-5 text-blue-400" />,
      tag: "bg-blue-500/10 text-blue-300",
      button:
        "border-blue-500/40 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/60",
    },
  },
  {
    number: 3,
    name: "Design High-Performing Architectures",
    weight: 24,
    services: ["ElastiCache", "CloudFront", "EBS", "Kinesis"],
    color: {
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      border: "border-purple-500/30 hover:border-purple-500/60",
      dot: "bg-purple-400",
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      tag: "bg-purple-500/10 text-purple-300",
      button:
        "border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/60",
    },
  },
  {
    number: 4,
    name: "Design Cost-Optimized Architectures",
    weight: 20,
    services: ["Savings Plans", "S3 Lifecycle", "Spot", "Trusted Advisor"],
    color: {
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      border: "border-emerald-500/30 hover:border-emerald-500/60",
      dot: "bg-emerald-400",
      icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
      tag: "bg-emerald-500/10 text-emerald-300",
      button:
        "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/60",
    },
  },
];

// ─── Study modes ─────────────────────────────────────────────────────────────

const studyModes = [
  {
    icon: <Zap className="h-7 w-7 text-yellow-400" />,
    title: "Quick Quiz",
    description: "10 random questions from any domain",
    bg: "bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40",
  },
  {
    icon: <Layers className="h-7 w-7 text-cyan-400" />,
    title: "Flashcard Drill",
    description: "Active recall on services and comparisons",
    bg: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40",
  },
  {
    icon: <Clock className="h-7 w-7 text-rose-400" />,
    title: "Exam Simulation",
    description: "65 questions, 130 minutes, full exam",
    bg: "bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40",
  },
];

// ─── Exam stats ───────────────────────────────────────────────────────────────

const examStats = [
  { value: "65", label: "Questions" },
  { value: "130", label: "Minutes" },
  { value: "4", label: "Domains" },
  { value: "~72%", label: "Pass Score" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="flex-1 bg-background text-foreground">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        {/* subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[700px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <Badge className="mb-6 border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1 text-xs font-medium tracking-wide">
          SAA-C03 Exam Prep
        </Badge>

        <h1 className="relative text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-white">AWS </span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Study Pal
          </span>
        </h1>

        <p className="relative mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Master the SAA-C03 exam with active recall, spaced repetition, and
          scenario-based practice
        </p>

        <div className="relative mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            render={<Link href="/quiz" />}
            className="bg-blue-600 text-white hover:bg-blue-500 px-8 font-semibold shadow-lg shadow-blue-900/40"
          >
            Start Studying
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/dashboard" />}
            className="border-white/20 text-white hover:bg-white/5 px-8 font-semibold"
          >
            View Progress
          </Button>
        </div>
      </section>

      {/* ── Exam stats strip ──────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-y divide-border/50 sm:grid-cols-4 sm:divide-y-0">
          {examStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center px-6 py-6 text-center"
            >
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Domain cards ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Exam Domains
          </h2>
          <p className="mt-2 text-muted-foreground">
            Four domains, each weighted by exam importance
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <Card
              key={domain.number}
              className={`flex flex-col border bg-card transition-colors duration-200 ${domain.color.border}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {domain.color.icon}
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Domain {domain.number}
                    </span>
                  </div>
                  <Badge
                    className={`shrink-0 border text-xs font-bold ${domain.color.badge}`}
                  >
                    {domain.weight}%
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-base font-semibold leading-snug text-white">
                  {domain.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                {/* Service tags */}
                <div className="flex flex-wrap gap-1.5">
                  {domain.services.map((svc) => (
                    <span
                      key={svc}
                      className={`rounded px-2 py-0.5 text-xs font-medium ${domain.color.tag}`}
                    >
                      {svc}
                    </span>
                  ))}
                </div>

                {/* Study button */}
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href={`/quiz?domain=${domain.number}`} />}
                  className={`w-full transition-colors ${domain.color.button}`}
                >
                  Study
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Study modes ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Study Modes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Choose your practice style
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {studyModes.map((mode) => (
            <Card
              key={mode.title}
              className={`border transition-colors duration-200 ${mode.bg}`}
            >
              <CardContent className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
                  {mode.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
