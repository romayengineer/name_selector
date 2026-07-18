import { v4 as uuidv4 } from 'uuid';
import type { Name } from '$lib/types/index';
import { shuffleNames } from './eloRanking';

interface NameGeneratorConfig {
  consonants?: string[];
  vowels?: string[];
  minSyllables?: number;
  maxSyllables?: number;
  initialEloRating?: number;
}

/**
 * Generates random names by combining consonants and vowels into syllables.
 * Names are assigned ELO ratings for comparison tracking.
 */
export class NameGenerator {
  private consonants: string[];
  private vowels: string[];
  private minSyllables: number;
  private maxSyllables: number;
  private initialEloRating: number;

  /**
   * @param config Configuration for name generation
   */
  constructor(config: NameGeneratorConfig = {}) {
    this.consonants = config.consonants ?? [
      'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
    ];
    this.vowels = config.vowels ?? ['a', 'e', 'i', 'o', 'u'];
    this.minSyllables = config.minSyllables ?? 3;
    this.maxSyllables = config.maxSyllables ?? 5;
    this.initialEloRating = config.initialEloRating ?? 1200;
  }

  /**
   * Selects a random element from an array.
   */
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a random integer in [0, max) with a bias toward 0 (low indices).
   *
   * How it works:
   * - `Math.random()` returns a uniform value in [0, 1).
   * - Raising it to a power > 1 (here `^2`) reshapes the distribution so that
   *   small values become far more likely than values near 1. For example,
   *   with exponent 2, ~57% of samples fall below 0.5, while only ~17% fall
   *   above 0.8. Increasing the exponent makes the bias toward 0 stronger.
   * - After applying the exponent, the result is scaled by `max` and floored
   *   to produce an integer index.
   *
   * Use this when you want low indices to be favored (e.g., picking from the
   * top of a sorted list more often) rather than uniformly random selection.
   *
   * @param max Exclusive upper bound on the returned index
   * @returns Integer in [0, max), biased toward 0
   */
  private getBiasedRandomIndex(max: number): number {
    return Math.floor(Math.pow(Math.random(), 2) * max);
  }

  /**
   * Generates a single syllable (consonant + vowel).
   */
  private generateSyllable(): string {
    const consonant = this.getRandomElement(this.consonants);
    const vowel = this.getRandomElement(this.vowels);
    return consonant + vowel;
  }

  /**
   * Generates a single random name with a random number of syllables.
   */
  private generateSingleName(): string {
    const syllableCount = Math.floor(
      Math.random() * (this.maxSyllables - this.minSyllables + 1)
    ) + this.minSyllables;
    let name = '';
    for (let i = 0; i < syllableCount; i++) {
      name += this.generateSyllable();
    }
    return name;
  }

  /**
   * Generates multiple unique names with initial ELO ratings.
   * @param count Number of names to generate
   * @param existingNames Set of names already in use (to avoid duplicates)
   * @returns Array of new Name objects
   */
  public generateNames(count: number, existingNames: Set<string>): Name[] {
    const newNames: Name[] = [];
    const maxAttempts: number = count * 10;

    let generated: number = 0;
    let attempts: number = 0;
    while (generated < count && attempts < maxAttempts) {
      const nameText = this.generateSingleName();
      attempts++;

      if (!existingNames.has(nameText)) {
        const newName: Name = {
          id: uuidv4(),
          text: nameText,
          eloRating: this.initialEloRating,
          wins: 0,
          losses: 0,
          comparisons: 0,
          createdAt: new Date().toISOString()
        };
        newNames.push(newName);
        existingNames.add(nameText);
        generated++;
      }
    }

    return newNames;
  }

  /**
   * Selects random names from a window of nearby names to provide meaningful comparisons.
   *
   * How it works:
   * - Assumes `names` is sorted by ELO rating in descending order (index 0 = highest rated).
   * - Picks a window of `windowSize` consecutive names to compare against each other.
   * - The window's starting index is generated via `getBiasedRandomIndex`, which
   *   biases toward 0. This means windows starting near the top of the list
   *   (i.e. containing names with higher ELO ratings) are selected more often
   *   than windows further down, giving top-ranked names more opportunities
   *   to be compared and separated.
   * - Within the chosen window, `count` unique names are picked uniformly at random.
   * - The selected names are then shuffled so their presentation order is random.
   *
   * @param names Array of all names to select from (expected to be sorted by ELO desc)
   * @param count Number of names to select (default: 2)
   * @returns Array of selected names from the same window
   */
  public getRandomNames(names: Name[], count: number = 2): Name[] {
    if (names.length < count) {
      return names;
    }

    const windowSize = Math.min(5 * count, names.length);
    const maxWindowIndex = names.length - windowSize + 1;
    const randomIndex = this.getBiasedRandomIndex(maxWindowIndex);
    const namesWindow = names.slice(randomIndex, randomIndex + windowSize);

    const selected: Name[] = [];
    const indices = new Set<number>();

    while (selected.length < count) {
      const windowIndex = Math.floor(Math.random() * namesWindow.length);
      if (!indices.has(windowIndex)) {
        indices.add(windowIndex);
        selected.push(namesWindow[windowIndex]);
      }
    }

    return shuffleNames(selected);
  }
}
