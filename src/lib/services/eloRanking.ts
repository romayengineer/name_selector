import type { Name, EloResult } from '$lib/types/index';

interface EloRankingConfig {
  kFactor?: number;
}

export class EloRanking {
  private kFactor: number;

  constructor(config?: EloRankingConfig) {
    this.kFactor = config?.kFactor ?? 32;
  }

  private getExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  updateEloRating(name: Name, opponent: Name, won: boolean): EloResult {
    const expectedScore = this.getExpectedScore(name.eloRating, opponent.eloRating);
    const actual = won ? 1 : 0;
    const ratingChange = this.kFactor * (actual - expectedScore);
    const newRating = name.eloRating + ratingChange;

    return {
      newRating: Math.round(newRating),
      ratingChange: Math.round(ratingChange)
    };
  }

  recordComparison(winner: Name, loser: Name): [Name, Name] {
    const winnerEloResult = this.updateEloRating(winner, loser, true);
    const loserEloResult = this.updateEloRating(loser, winner, false);

    const updatedWinner: Name = {
      ...winner,
      eloRating: winnerEloResult.newRating,
      wins: winner.wins + 1,
      comparisons: winner.comparisons + 1
    };

    const updatedLoser: Name = {
      ...loser,
      eloRating: loserEloResult.newRating,
      losses: loser.losses + 1,
      comparisons: loser.comparisons + 1
    };

    return [updatedWinner, updatedLoser];
  }

  rankNames(names: Name[]): Name[] {
    return [...names].sort((a, b) => b.eloRating - a.eloRating);
  }
}
