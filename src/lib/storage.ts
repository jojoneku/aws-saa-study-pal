export interface SavedSession {
  id: string
  completedAt: number
  mode: "practice" | "exam" | "weak-area"
  domain: "all" | 1 | 2 | 3 | 4
  totalQuestions: number
  correctAnswers: number
  scorePercent: number
  domainBreakdown: {
    domain: 1 | 2 | 3 | 4
    total: number
    correct: number
  }[]
  durationSeconds: number
}

const STORAGE_KEY = "aws-study-pal-sessions"
const FLASHCARD_KEY = "aws-study-pal-flashcards"
const PREFS_KEY = "aws-study-pal-quiz-prefs"
const MAX_SESSIONS = 50

// ─── Quiz preferences ─────────────────────────────────────────────────────────

export interface QuizPreferences {
  domain: "all" | "cross" | 1 | 2 | 3 | 4
  mode: "practice" | "exam" | "weak-area"
  difficulty: "mixed" | "medium" | "hard"
}

export function saveQuizPreferences(prefs: QuizPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch { /* SSR or private browsing */ }
}

export function loadQuizPreferences(): QuizPreferences | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuizPreferences
  } catch {
    return null
  }
}

// ─── Flashcard progress ───────────────────────────────────────────────────────

export interface FlashcardProgress {
  knownIds: string[]    // card IDs marked "Got It"
  studyIds: string[]    // card IDs marked "Study More"
  lastUpdated: number
}

export function saveFlashcardProgress(progress: FlashcardProgress): void {
  try {
    localStorage.setItem(FLASHCARD_KEY, JSON.stringify(progress))
  } catch { /* SSR or private browsing */ }
}

export function loadFlashcardProgress(): FlashcardProgress {
  try {
    const raw = localStorage.getItem(FLASHCARD_KEY)
    if (!raw) return { knownIds: [], studyIds: [], lastUpdated: 0 }
    return JSON.parse(raw) as FlashcardProgress
  } catch {
    return { knownIds: [], studyIds: [], lastUpdated: 0 }
  }
}

export function clearFlashcardProgress(): void {
  try {
    localStorage.removeItem(FLASHCARD_KEY)
  } catch { /* SSR or private browsing */ }
}

export function saveSessions(sessions: SavedSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // localStorage unavailable (SSR or private browsing)
  }
}

export function loadSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SavedSession[]
  } catch {
    return []
  }
}

export function addSession(session: SavedSession): void {
  try {
    const existing = loadSessions()
    const updated = [session, ...existing].slice(0, MAX_SESSIONS)
    saveSessions(updated)
  } catch {
    // localStorage unavailable
  }
}

export function clearSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function computeDomainStats(sessions: SavedSession[]): {
  domain: 1 | 2 | 3 | 4
  totalAnswered: number
  correct: number
  accuracy: number
  sessions: number
}[] {
  return ([1, 2, 3, 4] as const).map((domain) => {
    let totalAnswered = 0
    let correct = 0
    let sessionCount = 0

    for (const session of sessions) {
      const breakdown = session.domainBreakdown.find((b) => b.domain === domain)
      if (breakdown && breakdown.total > 0) {
        totalAnswered += breakdown.total
        correct += breakdown.correct
        sessionCount += 1
      }
    }

    const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0

    return {
      domain,
      totalAnswered,
      correct,
      accuracy,
      sessions: sessionCount,
    }
  })
}

// Domain exam weights: D1=30%, D2=26%, D3=24%, D4=20%
const DOMAIN_WEIGHTS: Record<1 | 2 | 3 | 4, number> = {
  1: 0.3,
  2: 0.26,
  3: 0.24,
  4: 0.2,
}

export function computeExamReadiness(sessions: SavedSession[]): number {
  if (sessions.length === 0) return 0

  let weightedSum = 0
  let totalWeight = 0

  for (const domain of [1, 2, 3, 4] as const) {
    // Collect sessions that have data for this domain
    const domainSessions = sessions
      .filter((s) => s.domainBreakdown.some((b) => b.domain === domain && b.total > 0))
      .slice(0, 3) // last 3 sessions (sessions are prepended, so first 3 are most recent)

    if (domainSessions.length === 0) continue

    // Average accuracy for last 3 sessions in this domain
    const accuracies = domainSessions.map((s) => {
      const bd = s.domainBreakdown.find((b) => b.domain === domain)!
      return bd.total > 0 ? (bd.correct / bd.total) * 100 : 0
    })

    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length
    const weight = DOMAIN_WEIGHTS[domain]

    weightedSum += avgAccuracy * weight
    totalWeight += weight
  }

  if (totalWeight === 0) return 0

  // Normalize so that a domain with no data doesn't drag score to 0;
  // scale the weighted sum to the actual coverage
  const readiness = Math.round(weightedSum / totalWeight)
  return Math.min(100, Math.max(0, readiness))
}
