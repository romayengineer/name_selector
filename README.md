# Name Selector

A web application that generates unique business names using syllable combinations and uses ELO-style ranking to help you find a name you love.

## Overview

Name Selector generates phonetically diverse business names by combining consonants and vowels into 3-5 syllable words. You compare names two at a time, and the app ranks them using an ELO rating system to surface your top-rated names over time.

## Features

- **Smart Name Generation**: Creates unique names by combining consonants and vowels
  - 3-5 syllables per name
  - Prevents duplicates with set-based tracking
  - Generate batches of 100 names on demand
  
- **Interactive Comparison**: Multiple input methods
  - Click names to vote
  - Arrow keys for keyboard navigation
  - Swipe gestures for mobile devices
  
- **ELO-based Ranking**: Names are ranked using an ELO rating system
  - Ratings adjust after each comparison
  - Top names surface naturally over time
  
- **Persistent Storage**: All data stored in browser localStorage
  - Generated names
  - ELO ratings
  - Comparison history
  
- **Ranking Table**: View all names with their current stats
  - Name
  - ELO rating
  - Win count
  - Total comparisons

## Tech Stack

- **Frontend Framework**: SvelteKit 2.61+ with Svelte 5.55+
- **Language**: TypeScript 5.6+ (strict mode, no JavaScript)
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 5.0+
- **Storage**: Browser localStorage
- **UUID Generation**: uuid 9.0+
- **Data Format**: JSON

## Node.js & Dependencies

- **Node.js**: 18.19.1+ (tested with v18)
- **npm**: 9.2.0+
- Vite v5 is compatible with Node 18.19+
- All dependencies aligned with gocommerce project patterns

## Project Structure

```
name_selector/
├── README.md                          # This file
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Main comparison view
│   │   └── +layout.svelte            # Layout wrapper
│   ├── lib/
│   │   ├── services/
│   │   │   ├── nameGenerator.ts       # Class-based name generation (configurable)
│   │   │   ├── eloRanking.ts          # ELO rating calculations
│   │   │   └── storage.ts             # localStorage management
│   │   ├── components/
│   │   │   ├── ComparisonView.svelte  # Two-name comparison UI
│   │   │   ├── RankingTable.svelte    # Ranking display
│   │   │   └── Controls.svelte        # Generate button, settings
│   │   ├── stores/
│   │   │   └── appState.ts            # Svelte stores for state management
│   │   └── types/
│   │       └── index.ts               # TypeScript definitions
│   └── app.css                        # Global styles
├── package.json
├── svelte.config.js
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Core Algorithms

### Name Generation

**Architecture**: `NameGenerator` is a configurable class that generates phonetic names.

**Syllable Structure**: Each syllable is a consonant + vowel combination.

```
Consonants: b, c, d, f, g, h, j, k, l, m, n, p, r, s, t, v, w, x, y, z
Vowels: a, e, i, o, u

Name = [Syllable₁][Syllable₂][Syllable₃...] where 3 ≤ count ≤ 5
```

**Configuration** (via constructor):
```typescript
const generator = new NameGenerator({
  consonants: ['b', 'c', 'd', ...],     // Custom consonants (optional)
  vowels: ['a', 'e', 'i', ...],         // Custom vowels (optional)
  minSyllables: 3,                       // Minimum syllables per name (default: 3)
  maxSyllables: 5,                       // Maximum syllables per name (default: 5)
  initialEloRating: 1200                 // Starting ELO rating (default: 1200)
});

// Usage
const names = generator.generateNames(100, existingNamesSet);
const pair = generator.getRandomNames(names, 2);
```

**Uniqueness**: Generated names are tracked in a `Set<string>` to prevent duplicates.

### ELO Ranking

The ELO system adjusts ratings after each comparison based on:
- Current ratings of both names
- Who was favored
- Surprise factor (if upset occurs)

**Formula**:
```
Rating_new = Rating_old + K * (Actual - Expected)

Where:
- K = scaling factor (typically 32)
- Actual = 1 if name won, 0 if name lost
- Expected = 1 / (1 + 10^((opponent_rating - rating) / 400))
```

**Initial Rating**: 1200 ELO (arbitrary starting point)

## Data Schema

### Generated Names
```json
{
  "names": [
    {
      "id": "uuid-v4",
      "text": "ketalo",
      "eloRating": 1250,
      "wins": 5,
      "losses": 3,
      "comparisons": 8,
      "createdAt": "2026-07-01T12:00:00Z"
    }
  ],
  "generatedNameSet": ["ketalo", "midale", "porina"]
}
```

## Development Roadmap

### Phase 1: MVP ✅ Complete
- [x] Initialize SvelteKit project with Svelte 5
- [x] Implement name generation service
- [x] Implement ELO ranking service
- [x] Implement localStorage persistence
- [x] Build comparison UI (click-based)
- [x] Build ranking table view
- [x] Build generation controls

### Phase 2: Input Methods
- [ ] Add keyboard navigation (arrow keys)
- [ ] Add touch/swipe support for mobile

### Phase 3: Polish
- [ ] Add name filtering/search
- [ ] Export generated names
- [ ] Settings (K-factor adjustment, reset data)
- [ ] Dark mode

## Development Guidelines

### TypeScript Requirements
- **All code must be TypeScript** — `.ts` and `.svelte` files only, no `.js` files
- Enable `strict: true` in `tsconfig.json`
- All functions must have explicit type annotations
- Use interfaces for data shapes
- No `any` types unless absolutely unavoidable
- Configure SvelteKit to enforce TypeScript

### Svelte 5 Best Practices
- Use `<script lang="ts">` in all `.svelte` files
- Use `$state()` rune for reactive state
- Use `$derived()` rune for derived values
- Use `$props()` rune with interface-based Props for component props
- Use `onclick` attribute instead of deprecated `on:click`
- Prefer Svelte stores for shared state
- Keep components focused and single-responsibility

### Architecture Patterns
- Use **classes** for services with stateful behavior and configuration (e.g., `NameGenerator`)
- Keep services **immutable-by-default**: return new instances rather than mutating state
- Use **TypeScript interfaces** for all configuration objects and type definitions
- Export **single instances** from module level when appropriate (e.g., `const nameGenerator = new NameGenerator()`)
- Use **private methods** for internal logic; expose only public methods

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Development Server Features
- Hot module reloading (HMR)
- Access at `http://localhost:5173`
- TypeScript strict mode enabled
- Tailwind CSS preprocessed on-the-fly

## How to Use

1. **Generate Names**: Start with 100 auto-generated names
2. **Compare**: Two random names appear; click the one you prefer
3. **Watch Rankings**: Use the ranking table to see your top names emerge
4. **Generate More**: Hit "Generate 100 More" to expand the pool and compare further
5. **Export**: (Phase 3) Download your top-rated names as JSON/CSV

## Notes

- All data is stored in browser localStorage; clearing browser data will reset the app
- ELO rating K-factor is fixed at 32 (can be made configurable later)
- Initial rating is 1200 for all newly generated names
