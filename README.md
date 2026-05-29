# AWS Study Pal

Free, open-source exam prep for the **AWS Solutions Architect Associate (SAA-C03)** certification. Built with Next.js, runs entirely in the browser — no account required.

**Live site → [aws-saa-study-pal.vercel.app](https://aws-saa-study-pal.vercel.app)**

---

## What's inside

### 330 Practice Questions
Scenario-based multiple choice questions grounded in real customer situations — not textbook definitions. Every question has four plausible options (no obviously wrong answers), detailed per-option explanations, and difficulty ratings from 2 to 5.

| Domain | Questions | Weight on exam |
|---|---|---|
| Domain 1 — Design Secure Architectures | 70 | 30% |
| Domain 2 — Design Resilient Architectures | 70 | 26% |
| Domain 3 — Design High-Performing Architectures | 70 | 24% |
| Domain 4 — Design Cost-Optimized Architectures | 70 | 20% |
| Cross-Domain (spans 2–4 domains) | 50 | — |

Difficulty scale:
- **2** — Foundation / Cloud Practitioner level
- **3** — Standard SAA scenario
- **4** — Hard: all 4 options are valid, one constraint narrows the answer
- **5** — Trap: tests common misconceptions that fail people on the real exam

### 3 Quiz Modes
- **Practice** — 10 questions with immediate feedback and full explanations after each answer
- **Exam Simulation** — 65 questions, 130-minute countdown, results revealed at the end
- **Weak Area Focus** — targets your lowest-scoring domains

### 120 Flashcards
Active recall cards across 5 categories: service definitions, concepts, comparisons, key numbers, and exam traps. Domain and difficulty filters. "Got It / Study More" tracking persists across sessions.

### 84-Service Reference
Plain-English guide to every AWS service that appears on the SAA-C03 exam. Searchable and filterable by category. Each entry includes what the service does, when to use it, key facts with specific numbers, and highlighted exam traps.

### Progress Dashboard
Exam readiness score weighted by domain exam weight (D1=30%, D2=26%, D3=24%, D4=20%). Per-domain accuracy bars, recent session history. All data stored in localStorage — no account needed.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui via Base UI (not Radix) |
| Persistence | localStorage |
| Deployment | Vercel |

---

## Running locally

```bash
git clone https://github.com/jojoneku/aws-saa-study-pal.git
cd aws-saa-study-pal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quiz/page.tsx         # Quiz setup (domain / mode / difficulty)
│   ├── quiz/session/page.tsx # Active quiz session
│   ├── dashboard/page.tsx    # Progress dashboard
│   ├── flashcards/page.tsx   # Flashcard drill
│   └── services/page.tsx     # AWS service reference
├── components/
│   ├── FlashCard.tsx         # 3D flip card component
│   ├── OptionButton.tsx      # Quiz answer option
│   └── ui/                   # shadcn/ui components
├── data/
│   ├── questions*.ts         # 330 SAA-C03 questions
│   └── flashcards.ts         # 120 flashcards
└── lib/
    ├── types.ts              # Question, Session, DomainStats interfaces
    ├── quiz.ts               # Filtering, shuffling, scoring utilities
    └── storage.ts            # localStorage helpers (sessions, flashcard progress, quiz prefs)

content/
├── domain1-knowledge-base.md   # Design Secure Architectures
├── domain2-knowledge-base.md   # Design Resilient Architectures
├── domain3-knowledge-base.md   # Design High-Performing Architectures
└── domain4-knowledge-base.md   # Design Cost-Optimized Architectures
```

The `content/` directory is the source of truth for all quiz questions, flashcards, and service reference entries.

---

## About the SAA-C03 exam

- **65 questions** (50 scored + ~15 unscored beta questions)
- **130 minutes**
- **Passing score:** 720 / 1000 (~72%)
- Mix of single-answer and multiple-response questions
- No domain labels on the real exam — questions blend concerns across domains

---

## Roadmap

- [ ] Supabase integration for cross-device progress sync
- [ ] Spaced repetition scheduling for flashcards
- [ ] Cloud Practitioner (CCP) question set
- [ ] Explanations linked to AWS documentation

---

## License

MIT
