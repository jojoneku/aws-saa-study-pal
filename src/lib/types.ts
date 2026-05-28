export type Domain = 1 | 2 | 3 | 4
export type Difficulty = 1 | 2 | 3 | 4 | 5
export type ConstraintType = "cost" | "ha" | "security" | "performance" | "ops" | "migration"
export type QuestionType = "single" | "multi-select"

export interface QuestionOption {
  id: "A" | "B" | "C" | "D"
  text: string
  isCorrect: boolean
  explanation: string // why this option is right or wrong
}

export interface Question {
  id: string
  domain: Domain
  taskStatement: string  // e.g. "1.1", "2.2", "3.3"
  services: string[]     // AWS services tested e.g. ["rds", "aurora"]
  constraintType: ConstraintType
  difficulty: Difficulty
  type: QuestionType
  stem: string           // the scenario question text
  options: QuestionOption[]
  explanation: string    // overall explanation shown after answering
  keywords: string[]     // exam keywords in the question e.g. ["most cost-effective", "multi-AZ"]
}

export interface QuizSession {
  id: string
  domain: Domain | "all"
  mode: "practice" | "exam" | "weak-area"
  questions: Question[]
  answers: Record<string, string | string[]>  // questionId -> answer(s)
  startedAt: number
  completedAt?: number
}

export interface DomainStats {
  domain: Domain
  totalAnswered: number
  correct: number
  accuracy: number
  weakServices: string[]
}
