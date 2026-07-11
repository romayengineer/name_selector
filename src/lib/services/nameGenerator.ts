import { v4 as uuidv4 } from 'uuid';
import type { Name } from '$lib/types/index';

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
   * @param names Array of all names to select from
   * @param count Number of names to select (default: 2)
   * @returns Array of selected names from the same window
   */
  public getRandomNames(names: Name[], count: number = 2): Name[] {
    if (names.length < count) {
      return names;
    }

    const windowSize = Math.min(5 * count, names.length);
    const maxWindowIndex = names.length - windowSize + 1;
    const randomIndex = Math.floor(Math.random() * maxWindowIndex);
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

    return selected;
  }
}
