# AWS SAA Study Pal

An interactive study tool for the AWS Solutions Architect Associate (SAA-C03) exam. Users can quiz themselves, review domain-specific knowledge, and track study progress.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Dev Commands
```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

## Project Structure
```
src/app/         # Next.js App Router pages and layouts
src/components/  # shared React components
content/         # AWS SAA domain knowledge-base markdown files (source of truth for quiz content)
```

## Knowledge Base
The `content/` directory holds four domain markdown files aligned to the SAA-C03 exam blueprint:
- `domain1-knowledge-base.md` — Design Secure Architectures
- `domain2-knowledge-base.md` — Design Resilient Architectures
- `domain3-knowledge-base.md` — Design High-Performing Architectures
- `domain4-knowledge-base.md` — Design Cost-Optimized Architectures

These files are the primary data source. Parse them at build time or runtime for quiz questions, summaries, and flashcards.

## Notes
- Keep all API logic in `src/app/api/` route handlers (no separate backend service)
- Target mobile-friendly layout — users study on the go
