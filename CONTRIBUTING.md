# Contributing to AWS Study Pal

Thanks for helping make this better! Contributions are welcome — whether it's new questions, fixing an explanation, adding a service, or improving the UI.

## Ways to contribute

| Type | What to do |
|---|---|
| Fix a wrong answer / explanation | Open an issue or submit a PR editing the relevant question file |
| Add practice questions | See [Adding Questions](#adding-questions) below |
| Add a service to the reference | Edit `src/app/services/data.ts` |
| Add flashcards | Edit `src/data/flashcards.ts` |
| UI bug or feature | Open an issue first to discuss |
| Typo / wording | Just submit the PR |

---

## Getting started

```bash
git clone https://github.com/jojoneku/aws-saa-study-pal.git
cd aws-saa-study-pal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Branch rules

- `master` is protected — no direct pushes
- All changes go through a Pull Request
- CI must pass (lint + build) before merging
- At least 1 review required

**Workflow:**
```bash
git checkout -b fix/d1-question-kms-explanation
# make your changes
git push origin fix/d1-question-kms-explanation
# open a PR to master on GitHub
```

---

## Adding Questions

Questions live in `src/data/`. Each domain has its own file:

| File | Domain |
|---|---|
| `questions.ts` | Original 10 per domain |
| `questions-d1-new.ts`, `questions-d1-new2.ts` | Domain 1 additions |
| `questions-d2-new.ts`, `questions-d2-new2.ts` | Domain 2 additions |
| `questions-d3-new.ts`, `questions-d3-new2.ts` | Domain 3 additions |
| `questions-d4-new.ts`, `questions-d4-new2.ts` | Domain 4 additions |
| `questions-cross.ts`, `questions-cross2.ts` | Cross-domain (2–4 domains) |

### Question format

```ts
{
  id: "d1-071",           // next sequential ID for the domain
  domain: 1,              // 1 | 2 | 3 | 4
  taskStatement: "1.2",   // see exam guide for task numbers
  services: ["kms", "s3"],
  constraintType: "security",  // "cost"|"ha"|"security"|"performance"|"ops"|"migration"
  difficulty: 4,          // 2=easy 3=standard 4=hard 5=trap
  type: "single",
  stem: "A company needs to...",  // spell out service names on first mention
  options: [
    { id: "A", text: "...", isCorrect: false, explanation: "Wrong because..." },
    { id: "B", text: "...", isCorrect: true,  explanation: "Correct because..." },
    { id: "C", text: "...", isCorrect: false, explanation: "Wrong because..." },
    { id: "D", text: "...", isCorrect: false, explanation: "Wrong because..." },
  ],
  explanation: "Overall explanation shown after answering...",
  keywords: ["MOST secure", "without storing credentials"],
}
```

### Quality checklist

- [ ] All 4 options are plausible — no obviously wrong answers
- [ ] Service names are spelled out on first mention: "AWS Key Management Service (AWS KMS)"
- [ ] At least one constraint keyword in the stem, capitalized: "MOST cost-effective"
- [ ] Each wrong answer explanation names the specific reason it fails
- [ ] Difficulty 4–5: the constraint in the stem is what separates options, not knowledge trivia
- [ ] No new unexplained services or concepts introduced without context
- [ ] ID follows the next sequential number for that file

After adding questions, register them in `src/data/questions.ts`:

```ts
import { myNewQuestions } from "./questions-d1-new3"
// ...
export const ALL_QUESTIONS: Question[] = [
  ...domain1Questions,
  ...myNewQuestions,  // add here
  // ...
]
```

---

## Fixing a question

If an answer is wrong or an explanation is misleading:

1. Open an issue with:
   - Question ID (e.g. `d1-025`)
   - What's wrong
   - What it should say (with a source if possible)
2. Or just submit a PR directly editing the file

---

## Code style

- TypeScript — no `any`
- Tailwind for styling — no inline styles except CSS transforms (flip card)
- Components use Base UI (not Radix) — use `render={<Link href="..." />}` + `nativeButton={false}` on Buttons wrapping links
- Run `npm run lint` before pushing

---

## Questions?

Open a [GitHub Discussion](https://github.com/jojoneku/aws-saa-study-pal/discussions) or an issue.
