import { v4 as uuidv4 } from 'uuid';
import type { Name } from '$lib/types/index';

const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const MIN_SYLLABLES = 3;
const MAX_SYLLABLES = 5;
const INITIAL_ELO_RATING = 1200;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSyllable(): string {
  const consonant = getRandomElement(CONSONANTS);
  const vowel = getRandomElement(VOWELS);
  return consonant + vowel;
}

function generateSingleName(): string {
  const syllableCount = Math.floor(Math.random() * (MAX_SYLLABLES - MIN_SYLLABLES + 1)) + MIN_SYLLABLES;
  let name = '';
  for (let i = 0; i < syllableCount; i++) {
    name += generateSyllable();
  }
  return name;
}

export function generateNames(
  count: number,
  existingNames: Set<string>
): Name[] {
  const newNames: Name[] = [];
  const maxAttempts: number = count * 10;

  let generated: number = 0;
  let attempts: number = 0;
  while (generated < count && attempts < maxAttempts) {
    const nameText = generateSingleName();
    attempts++;

    if (!existingNames.has(nameText)) {
      const newName: Name = {
        id: uuidv4(),
        text: nameText,
        eloRating: INITIAL_ELO_RATING,
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

export function getRandomNames(names: Name[], count: number = 2): Name[] {
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
