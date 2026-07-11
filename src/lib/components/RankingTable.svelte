<script lang="ts">
  import type { Name } from '$lib/types/index';

  interface Props {
    rankings?: Name[];
    maxRows?: number;
  }

  const { rankings = [], maxRows = 20 }: Props = $props();

  const displayedRankings = $derived(rankings.slice(0, maxRows));

  function getWinRate(wins: number, comparisons: number): string {
    if (comparisons === 0) return '0%';
    return ((wins / comparisons) * 100).toFixed(1) + '%';
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <div class="px-6 py-4 bg-slate-100 border-b border-slate-200">
    <h3 class="text-xl font-semibold text-slate-900">Top Rankings</h3>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th class="px-6 py-3 text-left text-base font-semibold text-slate-700">#</th>
          <th class="px-6 py-3 text-left text-base font-semibold text-slate-700">Name</th>
          <th class="px-6 py-3 text-right text-base font-semibold text-slate-700">ELO Rating</th>
          <th class="px-6 py-3 text-right text-base font-semibold text-slate-700">Wins</th>
          <th class="px-6 py-3 text-right text-base font-semibold text-slate-700">Losses</th>
          <th class="px-6 py-3 text-right text-base font-semibold text-slate-700">Win Rate</th>
          <th class="px-6 py-3 text-right text-base font-semibold text-slate-700">Total</th>
        </tr>
      </thead>
      <tbody>
        {#each displayedRankings as name, index (name.id)}
          <tr class="border-b border-slate-200 hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 text-base font-semibold text-slate-900">{index + 1}</td>
            <td class="px-6 py-4 text-base font-medium text-slate-900">{name.text}</td>
            <td class="px-6 py-4 text-base text-right text-slate-900 font-semibold">{name.eloRating}</td>
            <td class="px-6 py-4 text-base text-right text-green-600 font-medium">{name.wins}</td>
            <td class="px-6 py-4 text-base text-right text-red-600 font-medium">{name.losses}</td>
            <td class="px-6 py-4 text-base text-right text-slate-600">
              {getWinRate(name.wins, name.comparisons)}
            </td>
            <td class="px-6 py-4 text-base text-right text-slate-600">{name.comparisons}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if rankings.length === 0}
    <div class="px-6 py-8 text-center text-slate-500">
      <p>No rankings yet. Start comparing names!</p>
    </div>
  {/if}
</div>
