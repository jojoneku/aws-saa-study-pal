import { Question, Domain, QuizSession, DomainStats } from "./types"
import { ALL_QUESTIONS } from "../data/questions"

/**
 * Returns all questions for a specific domain.
 */
export function getQuestionsByDomain(domain: Domain): Question[] {
  return ALL_QUESTIONS.filter((q) => q.domain === domain)
}

/**
 * Returns `count` randomly sampled questions from the specified domain
 * (or all domains when domain is "all").
 * Uses a Fisher-Yates shuffle on a copy so the source array is not mutated.
 */
export function getRandomQuestions(domain: Domain | "all", count: number): Question[] {
  const pool =
    domain === "all"
      ? [...ALL_QUESTIONS]
      : [...getQuestionsByDomain(domain as Domain)]

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, Math.min(count, pool.length))
}

/**
 * Creates a new, unanswered QuizSession.
 */
export function createQuizSession(
  domain: Domain | "all",
  mode: QuizSession["mode"],
  count: number
): QuizSession {
  const questions = getRandomQuestions(domain, count)
  return {
    id: crypto.randomUUID(),
    domain,
    mode,
    questions,
    answers: {},
    startedAt: Date.now(),
  }
}

/**
 * Scores a completed QuizSession.
 *
 * For "single" type questions the answer is a string matching one of the
 * option ids ("A" | "B" | "C" | "D").
 * For "multi-select" the answer is an array of option ids; all correct ids
 * must be selected and no incorrect ones may be included.
 *
 * Returns overall accuracy plus a per-domain breakdown.
 */
export function scoreSession(session: QuizSession): {
  correct: number
  total: number
  accuracy: number
  byDomain: Record<number, { correct: number; total: number }>
} {
  let correct = 0
  const byDomain: Record<number, { correct: number; total: number }> = {}

  for (const question of session.questions) {
    const domain = question.domain

    // Initialise domain bucket
    if (!byDomain[domain]) {
      byDomain[domain] = { correct: 0, total: 0 }
    }
    byDomain[domain].total++

    const answer = session.answers[question.id]
    if (answer === undefined) continue // unanswered

    let isCorrect = false

    if (question.type === "single") {
      const correctOption = question.options.find((o) => o.isCorrect)
      isCorrect = correctOption !== undefined && answer === correctOption.id
    } else {
      // multi-select: answer must be string[]
      const correctIds = new Set(
        question.options.filter((o) => o.isCorrect).map((o) => o.id)
      )
      const answeredIds = new Set(answer as string[])
      isCorrect =
        answeredIds.size === correctIds.size &&
        [...correctIds].every((id) => answeredIds.has(id))
    }

    if (isCorrect) {
      correct++
      byDomain[domain].correct++
    }
  }

  const total = session.questions.length
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100 * 10) / 10

  return { correct, total, accuracy, byDomain }
}

/**
 * Analyses multiple past QuizSessions to identify the services where the
 * user performs worst.
 *
 * Returns a list sorted by ascending accuracy (weakest first), limited to
 * services that have been seen in at least 2 questions to avoid noise from
 * single-question outliers.
 */
export function getWeakAreas(
  sessions: QuizSession[]
): { service: string; accuracy: number }[] {
  // Map: service -> { correct, total }
  const serviceStats: Record<string, { correct: number; total: number }> = {}

  for (const session of sessions) {
    for (const question of session.questions) {
      const answer = session.answers[question.id]
      if (answer === undefined) continue // skip unanswered

      // Determine correctness
      let isCorrect = false
      if (question.type === "single") {
        const correctOption = question.options.find((o) => o.isCorrect)
        isCorrect = correctOption !== undefined && answer === correctOption.id
      } else {
        const correctIds = new Set(
          question.options.filter((o) => o.isCorrect).map((o) => o.id)
        )
        const answeredIds = new Set(answer as string[])
        isCorrect =
          answeredIds.size === correctIds.size &&
          [...correctIds].every((id) => answeredIds.has(id))
      }

      // Accumulate per service
      for (const service of question.services) {
        if (!serviceStats[service]) {
          serviceStats[service] = { correct: 0, total: 0 }
        }
        serviceStats[service].total++
        if (isCorrect) {
          serviceStats[service].correct++
        }
      }
    }
  }

  return Object.entries(serviceStats)
    .filter(([, stats]) => stats.total >= 2) // minimum sample threshold
    .map(([service, stats]) => ({
      service,
      accuracy: Math.round((stats.correct / stats.total) * 100 * 10) / 10,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
}

/**
 * Builds per-domain statistics from a list of completed sessions.
 * Useful for a progress dashboard.
 */
export function getDomainStats(sessions: QuizSession[]): DomainStats[] {
  const domains: Domain[] = [1, 2, 3, 4]

  return domains.map((domain) => {
    let totalAnswered = 0
    let correct = 0
    const serviceCorrect: Record<string, number> = {}
    const serviceTotal: Record<string, number> = {}

    for (const session of sessions) {
      for (const question of session.questions) {
        if (question.domain !== domain) continue

        const answer = session.answers[question.id]
        if (answer === undefined) continue

        totalAnswered++

        let isCorrect = false
        if (question.type === "single") {
          const correctOption = question.options.find((o) => o.isCorrect)
          isCorrect = correctOption !== undefined && answer === correctOption.id
        } else {
          const correctIds = new Set(
            question.options.filter((o) => o.isCorrect).map((o) => o.id)
          )
          const answeredIds = new Set(answer as string[])
          isCorrect =
            answeredIds.size === correctIds.size &&
            [...correctIds].every((id) => answeredIds.has(id))
        }

        if (isCorrect) correct++

        for (const service of question.services) {
          serviceTotal[service] = (serviceTotal[service] ?? 0) + 1
          if (isCorrect) {
            serviceCorrect[service] = (serviceCorrect[service] ?? 0) + 1
          }
        }
      }
    }

    // Identify weak services: accuracy below 60% with at least 2 attempts
    const weakServices = Object.keys(serviceTotal)
      .filter((s) => serviceTotal[s] >= 2)
      .filter((s) => {
        const acc = (serviceCorrect[s] ?? 0) / serviceTotal[s]
        return acc < 0.6
      })
      .sort((a, b) => {
        const accA = (serviceCorrect[a] ?? 0) / serviceTotal[a]
        const accB = (serviceCorrect[b] ?? 0) / serviceTotal[b]
        return accA - accB
      })

    const accuracy =
      totalAnswered === 0
        ? 0
        : Math.round((correct / totalAnswered) * 100 * 10) / 10

    return { domain, totalAnswered, correct, accuracy, weakServices }
  })
}
