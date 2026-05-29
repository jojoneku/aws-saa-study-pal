"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { services, type ServiceEntry } from "./data"

// ─── Category config ─────────────────────────────────────────────────────────

const categoryColors: Record<ServiceEntry["category"], string> = {
  compute:
    "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  storage:
    "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  database:
    "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  networking:
    "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  security:
    "bg-red-500/20 text-red-300 border border-red-500/30",
  integration:
    "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  analytics:
    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  management:
    "bg-slate-500/20 text-slate-300 border border-slate-500/30",
}

const domainColors: Record<1 | 2 | 3 | 4, string> = {
  1: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  2: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  3: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  4: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
}

const categories = [
  "all",
  "compute",
  "storage",
  "database",
  "networking",
  "security",
  "integration",
  "analytics",
  "management",
] as const

// ─── ServiceCard ─────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: ServiceEntry }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      {/* Top row: category badge + domain chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${categoryColors[service.category]}`}
        >
          {service.category}
        </span>
        {service.domains.map((d) => (
          <span
            key={d}
            className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${domainColors[d]}`}
          >
            D{d}
          </span>
        ))}
      </div>

      {/* Service name */}
      <div>
        <h2 className="text-sm font-bold text-white leading-snug">
          {service.name}
        </h2>
        <span className="mt-1 inline-block rounded bg-white/5 px-2 py-0.5 text-xs text-white/50">
          {service.abbr}
        </span>
      </div>

      {/* Tagline */}
      <p className="text-xs text-muted-foreground">{service.tagline}</p>

      <hr className="border-border/50" />

      {/* What it does */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
          What it does
        </p>
        <p className="text-xs text-white/80 leading-relaxed">{service.whatItDoes}</p>
      </div>

      {/* When to use */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
          When to use
        </p>
        <p className="text-xs italic text-muted-foreground leading-relaxed">
          {service.whenToUse}
        </p>
      </div>

      {/* Key facts */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/40">
          Key facts
        </p>
        <ul className="space-y-1">
          {service.keyFacts.map((fact, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs text-white/70 leading-relaxed"
            >
              <span className="mt-0.5 shrink-0 text-white/30">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Exam traps */}
      {service.examTraps.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-sm">⚠</span>
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
              Exam Traps
            </p>
          </div>
          <ul className="space-y-1.5">
            {service.examTraps.map((trap, i) => (
              <li key={i} className="text-xs text-amber-200/80 leading-relaxed">
                {trap}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filtered = services.filter((s) => {
    const matchesCategory =
      activeCategory === "all" || s.category === activeCategory
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.abbr.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.category.includes(q)
    return matchesCategory && matchesSearch
  })

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
            className="text-muted-foreground hover:text-white"
          >
            ← Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <Badge className="mb-4 border border-blue-500/30 bg-blue-500/10 text-blue-300 px-3 py-1 text-xs font-medium tracking-wide">
            AWS Service Reference
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            AWS Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Plain-English guide to every service on the SAA-C03 exam
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, abbreviation, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          />
        </div>

        {/* Category pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="mb-6 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-white">{filtered.length}</span> of{" "}
          <span className="font-semibold text-white">{services.length}</span>{" "}
          services
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No services match your search. Try a different term.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
