<script lang="ts">
  import { onMount } from 'svelte';
  import type { Name } from '$lib/types/index';
  import ComparisonView from '$lib/components/ComparisonView.svelte';
  import RankingTable from '$lib/components/RankingTable.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import { names, currentComparison, rankings } from '$lib/stores/appState';

  let showRankings = $state(false);

  const totalMatches = $derived(Math.floor($names.reduce((sum: number, name: Name) => sum + name.wins, 0)));

  onMount(() => {
    names.initializeApp();
  });

  function handleSelect(winner: Name, losers: Name[]): void {
    names.recordNWay(winner, losers);
  }

  function handleGenerateMore(): void {
    names.generateMoreNames();
  }
</script>

<div class="space-y-8">
  {#if showRankings}
    <RankingTable rankings={$rankings} />
  {:else}
    <ComparisonView
      names={$currentComparison}
      onSelect={handleSelect}
    />
  {/if}

  <div class="flex gap-4 justify-center">
    <button
      onclick={() => (showRankings = false)}
      class="px-6 py-2 rounded-lg font-semibold transition-colors {!showRankings
        ? 'bg-blue-600 text-white'
        : 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50'}"
    >
      Compare
    </button>
    <button
      onclick={() => (showRankings = true)}
      class="px-6 py-2 rounded-lg font-semibold transition-colors {showRankings
        ? 'bg-blue-600 text-white'
        : 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50'}"
    >
      Rankings
    </button>
  </div>

  <Controls onGenerateMore={handleGenerateMore} totalNames={$names.length} totalMatches={totalMatches} />
</div>
