"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronDown, ChevronRight, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { services, type ServiceEntry } from "./data"

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  ServiceEntry["category"],
  { label: string; color: string; dot: string; border: string }
> = {
  compute:     { label: "Compute",     color: "text-yellow-300",  dot: "bg-yellow-400",  border: "border-yellow-500/30" },
  storage:     { label: "Storage",     color: "text-blue-300",    dot: "bg-blue-400",    border: "border-blue-500/30" },
  database:    { label: "Database",    color: "text-purple-300",  dot: "bg-purple-400",  border: "border-purple-500/30" },
  networking:  { label: "Networking",  color: "text-cyan-300",    dot: "bg-cyan-400",    border: "border-cyan-500/30" },
  security:    { label: "Security",    color: "text-red-300",     dot: "bg-red-400",     border: "border-red-500/30" },
  integration: { label: "Integration", color: "text-orange-300",  dot: "bg-orange-400",  border: "border-orange-500/30" },
  analytics:   { label: "Analytics",   color: "text-emerald-300", dot: "bg-emerald-400", border: "border-emerald-500/30" },
  management:  { label: "Management",  color: "text-slate-300",   dot: "bg-slate-400",   border: "border-slate-500/30" },
}

const DOMAIN_CONFIG = {
  1: { label: "Domain 1 — Design Secure Architectures",          short: "D1", color: "text-amber-300",   dot: "bg-amber-400",   badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",   border: "border-amber-500/30" },
  2: { label: "Domain 2 — Design Resilient Architectures",       short: "D2", color: "text-blue-300",    dot: "bg-blue-400",    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",       border: "border-blue-500/30" },
  3: { label: "Domain 3 — Design High-Performing Architectures", short: "D3", color: "text-purple-300",  dot: "bg-purple-400",  badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",  border: "border-purple-500/30" },
  4: { label: "Domain 4 — Design Cost-Optimized Architectures",  short: "D4", color: "text-emerald-300", dot: "bg-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", border: "border-emerald-500/30" },
} as const

const CATEGORY_ORDER: ServiceEntry["category"][] = [
  "security", "compute", "storage", "database",
  "networking", "integration", "analytics", "management",
]

// ─── Service row ──────────────────────────────────────────────────────────────

function ServiceRow({
  service,
  studied,
  onToggle,
}: {
  service: ServiceEntry
  studied: boolean
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "border-b border-white/5 last:border-0 transition-colors",
        studied && "bg-white/[0.02]"
      )}
    >
      {/* ── Row header ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(service.id)}
          aria-label={studied ? "Mark as not studied" : "Mark as studied"}
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all",
            studied
              ? "border-emerald-500/70 bg-emerald-500/20 text-emerald-400"
              : "border-white/20 hover:border-white/40"
          )}
        >
          {studied && <Check className="h-3 w-3" />}
        </button>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left min-w-0"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "text-sm font-semibold transition-colors",
                studied ? "text-white/50 line-through decoration-white/30" : "text-white"
              )}>
                {service.shortName}
              </span>
              <span className="text-xs text-white/30">{service.abbr}</span>
              {/* Domain chips */}
              <div className="flex gap-1">
                {service.domains.map((d) => (
                  <span
                    key={d}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                      DOMAIN_CONFIG[d].badge
                    )}
                  >
                    {DOMAIN_CONFIG[d].short}
                  </span>
                ))}
              </div>
            </div>
            {!open && (
              <p className="mt-0.5 text-xs text-white/40 truncate">{service.tagline}</p>
            )}
          </div>
          <span className="shrink-0 text-white/30">
            {open
              ? <ChevronDown className="h-4 w-4" />
              : <ChevronRight className="h-4 w-4" />
            }
          </span>
        </button>
      </div>

      {/* ── Expanded detail ── */}
      {open && (
        <div className="px-4 pb-4 pl-12 space-y-3">
          {/* Tagline */}
          <p className="text-sm text-white/80 font-medium">{service.tagline}</p>

          {/* What it does */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-1">What it does</p>
            <p className="text-sm text-white/70 leading-relaxed">{service.whatItDoes}</p>
          </div>

          {/* When to use */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-1">When to use</p>
            <p className="text-sm text-white/60 leading-relaxed italic">{service.whenToUse}</p>
          </div>

          {/* Key facts */}
          {service.keyFacts.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-1.5">Key facts</p>
              <ul className="space-y-1">
                {service.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/60">
                    <span className="shrink-0 mt-0.5 text-white/20">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exam traps */}
          {service.examTraps.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/70 mb-1.5">⚠ Exam traps</p>
              <ul className="space-y-1.5">
                {service.examTraps.map((trap, i) => (
                  <li key={i} className="text-xs text-amber-200/70 leading-relaxed">{trap}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Group section ────────────────────────────────────────────────────────────

function GroupSection({
  title,
  color,
  dot,
  border,
  items,
  studied,
  onToggle,
  defaultOpen,
}: {
  title: string
  color: string
  dot: string
  border: string
  items: ServiceEntry[]
  studied: Set<string>
  onToggle: (id: string) => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? true)
  const doneCount = items.filter((s) => studied.has(s.id)).length

  return (
    <div className={cn("rounded-xl border overflow-hidden", border, "border-opacity-30")}>
      {/* Group header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
        <span className={cn("flex-1 text-sm font-semibold", color)}>{title}</span>
        {/* Progress */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="h-1 w-20 rounded-full bg-white/10 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", dot)}
                style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-white/40 tabular-nums w-12 text-right">
            {doneCount}/{items.length}
          </span>
          {open
            ? <ChevronDown className="h-4 w-4 text-white/30" />
            : <ChevronRight className="h-4 w-4 text-white/30" />
          }
        </div>
      </button>

      {/* Service rows */}
      {open && (
        <div className="border-t border-white/5">
          {items.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              studied={studied.has(service.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [viewBy, setViewBy] = useState<"category" | "domain">("category")
  const [studied, setStudied] = useState<Set<string>>(new Set())

  // Load from localStorage
  useEffect(() => {
    import("@/lib/storage").then(({ loadStudiedServices }) => {
      setStudied(loadStudiedServices())
    })
  }, [])

  function handleToggle(id: string) {
    setStudied((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      import("@/lib/storage").then(({ saveStudiedServices }) => saveStudiedServices(next))
      return next
    })
  }

  // Filter by search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return services
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.abbr.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.category.includes(q)
    )
  }, [search])

  // Group by category
  const byCategory = useMemo(() =>
    CATEGORY_ORDER.map((cat) => ({
      key: cat,
      ...CATEGORY_CONFIG[cat],
      items: filtered.filter((s) => s.category === cat),
    })).filter((g) => g.items.length > 0),
    [filtered]
  )

  // Group by domain
  const byDomain = useMemo(() =>
    ([1, 2, 3, 4] as const).map((d) => ({
      key: d,
      ...DOMAIN_CONFIG[d],
      label: DOMAIN_CONFIG[d].label,
      items: filtered.filter((s) => s.domains.includes(d)),
    })).filter((g) => g.items.length > 0),
    [filtered]
  )

  const totalStudied = studied.size
  const totalServices = services.length
  const overallPct = totalServices > 0 ? Math.round((totalStudied / totalServices) * 100) : 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 flex items-start justify-center overflow-hidden">
        <div className="h-[500px] w-[700px] rounded-full bg-blue-600/8 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">

        {/* Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">AWS Service Reference</h1>
          <p className="mt-2 text-white/50">
            {totalServices} services · plain English · exam traps highlighted
          </p>

          {/* Overall progress */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-white tabular-nums shrink-0">
              {totalStudied}/{totalServices} studied
            </span>
            {totalStudied > 0 && (
              <button
                onClick={() => {
                  if (!window.confirm("Reset all service progress?")) return
                  setStudied(new Set())
                  import("@/lib/storage").then(({ clearStudiedServices }) => clearStudiedServices())
                }}
                className="text-xs text-white/25 hover:text-white/50 transition-colors shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-blue-400/50 focus:outline-none transition-colors"
            />
          </div>

          {/* View toggle */}
          <div className="flex rounded-xl border border-white/10 overflow-hidden shrink-0">
            {(["category", "domain"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewBy(v)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  viewBy === v
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                By {v}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {search && (
          <p className="mb-4 text-xs text-white/40">
            {filtered.length} of {totalServices} services match &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Groups */}
        <div className="space-y-3">
          {viewBy === "category"
            ? byCategory.map((group) => (
                <GroupSection
                  key={group.key}
                  title={group.label}
                  color={group.color}
                  dot={group.dot}
                  border={group.border}
                  items={group.items}
                  studied={studied}
                  onToggle={handleToggle}
                  defaultOpen={group.items.length <= 12}
                />
              ))
            : byDomain.map((group) => (
                <GroupSection
                  key={group.key}
                  title={group.label}
                  color={group.color}
                  dot={group.dot}
                  border={group.border}
                  items={group.items}
                  studied={studied}
                  onToggle={handleToggle}
                  defaultOpen={false}
                />
              ))
          }

          {filtered.length === 0 && (
            <div className="py-20 text-center text-white/30 text-sm">
              No services match &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
