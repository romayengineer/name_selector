import type { Name, EloResult } from '$lib/types/index';

interface EloRankingConfig {
  kFactor?: number;
}

export class EloRanking {
  private kFactor: number;

  /** Creates an EloRanking instance with optional K-factor configuration. */
  constructor(config?: EloRankingConfig) {
    this.kFactor = config?.kFactor ?? 32;
  }

  /** Calculates expected win probability for a name against an opponent using ELO formula. */
  private getExpectedScore(ratingA: number, ratingB: number): number {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }

  /** Updates a name's ELO rating based on comparison outcome against an opponent. */
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

  /** Records a comparison where one name wins against multiple losers and returns all updated names. */
  recordNComparisons(winner: Name, losers: Name[]): Name[] {
    let totalWinnerRatingChange = 0;
    const updatedLosers: Name[] = [];

    for (const loser of losers) {
      const winnerEloResult = this.updateEloRating(winner, loser, true);
      const loserEloResult = this.updateEloRating(loser, winner, false);

      totalWinnerRatingChange += winnerEloResult.ratingChange;
      updatedLosers.push({
        ...loser,
        eloRating: loserEloResult.newRating,
        losses: loser.losses + 1,
        comparisons: loser.comparisons + 1
      });
    }

    const updatedWinner: Name = {
      ...winner,
      eloRating: Math.round(winner.eloRating + totalWinnerRatingChange),
      wins: winner.wins + losers.length,
      comparisons: winner.comparisons + losers.length
    };

    return [updatedWinner, ...updatedLosers];
  }

  /** Sorts names by ELO rating in descending order (highest rated first). */
  rankNames(names: Name[]): Name[] {
    return [...names].sort((a, b) => b.eloRating - a.eloRating);
  }
}
