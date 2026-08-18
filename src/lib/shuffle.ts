import type { Question } from "./types"

const OPTION_IDS = ["A", "B", "C", "D"] as const

/**
 * Fisher-Yates shuffle on a copy, so the source array is not mutated.
 */
export function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Returns a copy of the question with its options in random order and their
 * ids reassigned A–D by new position.
 *
 * The authored question bank places the correct answer in slot B for ~78% of
 * single-answer questions, so without this the letter alone gives the answer
 * away. Callers must use the returned question (not the source) for scoring,
 * since the ids no longer match the authored order.
 *
 * This module deliberately imports no question data — it is pulled into the
 * client bundle by the quiz session page.
 */
export function shuffleQuestionOptions(question: Question): Question {
  return {
    ...question,
    options: shuffled(question.options).map((option, i) => ({
      ...option,
      id: OPTION_IDS[i],
    })),
  }
}
