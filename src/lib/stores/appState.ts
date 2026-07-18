import { writable, derived } from 'svelte/store';
import type { Name } from '$lib/types/index';
import { NameGenerator } from '$lib/services/nameGenerator';
import { eloDescending, EloRanking } from '$lib/services/eloRanking';
import { loadData, saveData } from '$lib/services/storage';

const newNamesCounter = 20

const nameGenerator = new NameGenerator({
  minSyllables: 3,
  maxSyllables: 3,
});

const eloRanking = new EloRanking({
  kFactor: 32
});

function createAppState() {
  const { subscribe, set, update } = writable<Name[]>([]);
  const generatedNameSet = writable<Set<string>>(new Set());

  const initializeApp = (): void => {
    const { names, generatedNameSet: nameSet } = loadData();

    if (names.length === 0) {
      const newNames = nameGenerator.generateNames(newNamesCounter, nameSet);
      set(newNames);
      generatedNameSet.set(nameSet);
      saveData(newNames, nameSet);
    } else {
      set(names);
      generatedNameSet.set(nameSet);
    }
  };

  const generateMoreNames = (): void => {
    update((names: Name[]) => {
      let currentNameSet: Set<string> = new Set();
      generatedNameSet.subscribe((s) => {
        currentNameSet = s;
      })();

      const newNames = nameGenerator.generateNames(newNamesCounter, currentNameSet);
      const allNames = eloDescending([...names, ...newNames]);
      generatedNameSet.set(currentNameSet);
      saveData(allNames, currentNameSet);
      return allNames;
    });
  };

  const recordNWay = (winner: Name, losers: Name[]): void => {
    update((names: Name[]) => {
      const results = eloRanking.recordNComparisons(winner, losers);

      let updatedNames: Name[] = [...names];
      let updatedNamesIds: string[] = updatedNames.map(n => n.id);

      results.forEach((updatedName) => {
        const index = updatedNamesIds.indexOf(updatedName.id);
        if (index < 0) return;
        updatedNames[index] = updatedName;
      })

      updatedNames = eloDescending(updatedNames)

      let currentNameSet: Set<string> = new Set();
      generatedNameSet.subscribe((s) => {
        currentNameSet = s;
      })();

      saveData(updatedNames, currentNameSet);
      return updatedNames;
    });
  };

  return {
    subscribe,
    initializeApp,
    generateMoreNames,
    recordNWay
  };
}

export const names = createAppState();

export const currentComparison = derived(names, (n: Name[]) => {
  const trio = nameGenerator.getRandomNames(n, 2 * 7);
  return trio as Name[];
});

export const rankings = derived(names, (n: Name[]) => {
  return eloRanking.rankNames(n);
});
