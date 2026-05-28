"use client"

import type { QuestionOption } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OptionButtonProps {
  option: QuestionOption
  selected: boolean
  revealed: boolean
  onClick: () => void
}

export function OptionButton({
  option,
  selected,
  revealed,
  onClick,
}: OptionButtonProps) {
  const isCorrect = option.isCorrect
  const isSelectedWrong = selected && revealed && !isCorrect
  const isSelectedCorrect = selected && revealed && isCorrect
  const isUnselectedCorrect = !selected && revealed && isCorrect

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={revealed}
      className={cn(
        // base
        "group/option w-full rounded-xl border px-4 py-4 text-left text-sm font-medium transition-all duration-150",
        "flex items-start gap-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:cursor-default",

        // default (not answered)
        !revealed && [
          "border-white/10 bg-card text-white",
          selected
            ? "border-blue-400/60 bg-blue-500/15 ring-1 ring-blue-400/30"
            : "hover:border-white/25 hover:bg-white/5",
        ],

        // correct (selected or unselected — show right answer)
        (isSelectedCorrect || isUnselectedCorrect) &&
          "border-emerald-500/60 bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/30",

        // selected wrong
        isSelectedWrong &&
          "border-red-500/60 bg-red-500/15 text-red-100 ring-1 ring-red-500/30",

        // other options after reveal — dim them
        revealed &&
          !isCorrect &&
          !selected &&
          "border-white/5 bg-white/[0.03] text-white/40"
      )}
    >
      {/* Letter badge */}
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
          // default badge
          !revealed && [
            selected ? "bg-blue-500/40 text-blue-200" : "bg-white/10 text-white/70",
          ],
          (isSelectedCorrect || isUnselectedCorrect) && "bg-emerald-500/40 text-emerald-200",
          isSelectedWrong && "bg-red-500/40 text-red-200",
          revealed && !isCorrect && !selected && "bg-white/5 text-white/30"
        )}
      >
        {option.id}
      </span>

      {/* Option text */}
      <span className="flex-1 leading-relaxed">{option.text}</span>

      {/* Revealed icon */}
      {revealed && isSelectedCorrect && (
        <span className="mt-0.5 shrink-0 text-emerald-400 text-base">✓</span>
      )}
      {revealed && isUnselectedCorrect && (
        <span className="mt-0.5 shrink-0 text-emerald-400 text-base">✓</span>
      )}
      {revealed && isSelectedWrong && (
        <span className="mt-0.5 shrink-0 text-red-400 text-base">✗</span>
      )}
    </button>
  )
}
