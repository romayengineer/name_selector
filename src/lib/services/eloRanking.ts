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

  recordThreeWayComparison(winner: Name, loser1: Name, loser2: Name): [Name, Name, Name] {
    const winnerVsLoser1 = this.updateEloRating(winner, loser1, true);
    const loser1VsWinner = this.updateEloRating(loser1, winner, false);

    const winnerVsLoser2 = this.updateEloRating(winner, loser2, true);
    const loser2VsWinner = this.updateEloRating(loser2, winner, false);

    const totalWinnerRatingChange = winnerVsLoser1.ratingChange + winnerVsLoser2.ratingChange;

    const updatedWinner: Name = {
      ...winner,
      eloRating: Math.round(winner.eloRating + totalWinnerRatingChange),
      wins: winner.wins + 2,
      comparisons: winner.comparisons + 2
    };

    const updatedLoser1: Name = {
      ...loser1,
      eloRating: loser1VsWinner.newRating,
      losses: loser1.losses + 1,
      comparisons: loser1.comparisons + 1
    };

    const updatedLoser2: Name = {
      ...loser2,
      eloRating: loser2VsWinner.newRating,
      losses: loser2.losses + 1,
      comparisons: loser2.comparisons + 1
    };

    return [updatedWinner, updatedLoser1, updatedLoser2];
  }

  rankNames(names: Name[]): Name[] {
    return [...names].sort((a, b) => b.eloRating - a.eloRating);
  }
}
