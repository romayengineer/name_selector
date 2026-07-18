import type { Name } from '$lib/types/index';
import { eloDescending } from './eloRanking';

const STORAGE_KEY = 'name_selector_data';

interface StorageData {
  names: Name[];
  generatedNameSet: string[];
}

export function loadData(): { names: Name[]; generatedNameSet: Set<string> } {
  if (typeof window === 'undefined') {
    return { names: [], generatedNameSet: new Set() };
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return { names: [], generatedNameSet: new Set() };
  }

  try {
    const data: StorageData = JSON.parse(stored);
    return {
      names: eloDescending(data.names),
      generatedNameSet: new Set(data.generatedNameSet)
    };
  } catch {
    return { names: [], generatedNameSet: new Set() };
  }
}

export function saveData(names: Name[], generatedNameSet: Set<string>): void {
  if (typeof window === 'undefined') {
    return;
  }

  const data: StorageData = {
    names: eloDescending(names),
    generatedNameSet: Array.from(generatedNameSet)
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

export function downloadData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const json = localStorage.getItem(STORAGE_KEY) ?? JSON.stringify({
    names: [],
    generatedNameSet: []
  });

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.href = url;
  link.download = `name_selector_data_${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
