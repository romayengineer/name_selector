export interface Name {
  id: string;
  text: string;
  eloRating: number;
  wins: number;
  losses: number;
  comparisons: number;
  createdAt: string;
}

export interface AppState {
  names: Name[];
  generatedNameSet: Set<string>;
  currentComparison: [Name, Name] | null;
  rankings: Name[];
}

export interface ComparisonResult {
  winner: Name;
  loser: Name;
}

export interface EloResult {
  newRating: number;
  ratingChange: number;
}
