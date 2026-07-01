import { v4 as uuidv4 } from 'uuid';
import type { Name } from '$lib/types/index';

interface NameGeneratorConfig {
  consonants?: string[];
  vowels?: string[];
  minSyllables?: number;
  maxSyllables?: number;
  initialEloRating?: number;
}

export class NameGenerator {
  private consonants: string[];
  private vowels: string[];
  private minSyllables: number;
  private maxSyllables: number;
  private initialEloRating: number;

  constructor(config: NameGeneratorConfig = {}) {
    this.consonants = config.consonants ?? [
      'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'
    ];
    this.vowels = config.vowels ?? ['a', 'e', 'i', 'o', 'u'];
    this.minSyllables = config.minSyllables ?? 3;
    this.maxSyllables = config.maxSyllables ?? 5;
    this.initialEloRating = config.initialEloRating ?? 1200;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateSyllable(): string {
    const consonant = this.getRandomElement(this.consonants);
    const vowel = this.getRandomElement(this.vowels);
    return consonant + vowel;
  }

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

  public getRandomNames(names: Name[], count: number = 2): Name[] {
    if (names.length < count) {
      return names;
    }

    const selected: Name[] = [];
    const indices = new Set<number>();

    while (selected.length < count) {
      const randomIndex = Math.floor(Math.random() * names.length);
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex);
        selected.push(names[randomIndex]);
      }
    }

    return selected;
  }
}
