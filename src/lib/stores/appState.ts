import { writable, derived } from 'svelte/store';
import type { Name } from '$lib/types/index';
import { NameGenerator } from '$lib/services/nameGenerator';
import { recordComparison, rankNames } from '$lib/services/eloRanking';
import { loadData, saveData } from '$lib/services/storage';

const newNamesCounter = 20

const nameGenerator = new NameGenerator({
  minSyllables: 3,
  maxSyllables: 3,
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
      const allNames = [...names, ...newNames];
      generatedNameSet.set(currentNameSet);
      saveData(allNames, currentNameSet);
      return allNames;
    });
  };

  const recordWin = (winner: Name, loser: Name): void => {
    update((names: Name[]) => {
      const [updatedWinner, updatedLoser] = recordComparison(winner, loser);

      const updatedNames = names.map((n: Name) => {
        if (n.id === updatedWinner.id) return updatedWinner;
        if (n.id === updatedLoser.id) return updatedLoser;
        return n;
      });

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
    recordWin
  };
}

export const names = createAppState();

export const currentComparison = derived(names, (n: Name[]) => {
  if (n.length < 2) return null;
  const pair = nameGenerator.getRandomNames(n, 2);
  return pair as [Name, Name];
});

export const rankings = derived(names, (n: Name[]) => {
  return rankNames(n);
});
