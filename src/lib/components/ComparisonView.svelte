<script lang="ts">
  import type { Name } from '$lib/types/index';

  interface Props {
    names: Name[];
    onSelect: (winner: Name, losers: Name[]) => void;
  }

  const { names, onSelect }: Props = $props();

  let selectedIndex: number | null = $state(null);

  function getOtherNames(selected: Name): Name[] {
    const index = names.map(n => n.id).indexOf(selected.id);
    if (index < 0) return names;
    names.splice(index, 1); // splice updates names
    return names;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      selectedIndex = selectedIndex != null ? selectedIndex > 0 ? selectedIndex - 1 : names.length - 1 : 0;
    } else if (event.key === 'ArrowRight') {
      selectedIndex = selectedIndex != null ? (selectedIndex + 1) % names.length : 0;
    } else if (event.key === 'Enter') {
      if (selectedIndex == null) return;
      const winner = names[selectedIndex % names.length];
      if (winner) {
        const losers = getOtherNames(winner);
        if (losers) {
          onSelect(winner, losers);
        }
      }
      selectedIndex = null;
    }
  }

  function handleClick(winner: Name): void {
    const losers = getOtherNames(winner);
    if (losers) {
      onSelect(winner, losers);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col gap-4">
  <h2 class="text-2xl font-semibold text-center text-slate-700">Which name do you prefer?</h2>

  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    {#each names as name, index (name.id)}
      <button
        onclick={() => name && handleClick(name)}
        class="p-4 rounded-lg transition-all cursor-pointer {selectedIndex === index
          ? 'ring-4 ring-blue-500 bg-blue-50'
          : 'bg-white hover:shadow-lg'} shadow-md"
      >
        <div class="text-3xl font-bold text-slate-900">{name?.text || ''}</div>
      </button>
    {/each}
  </div>

  <div class="text-center text-sm text-slate-500">
    Use arrow keys to select, Enter to confirm, or click directly
  </div>
</div>
