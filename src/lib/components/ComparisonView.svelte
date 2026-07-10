<script lang="ts">
  import type { Name } from '$lib/types/index';

  interface Props {
    name1?: Name;
    name2?: Name;
    name3?: Name;
    onSelect: (winner: Name, loser1: Name, loser2: Name) => void;
  }

  const { name1, name2, name3, onSelect }: Props = $props();

  let selectedIndex: number | null = $state(null);

  function getOtherNames(selected: Name): [Name, Name] | null {
    if (selected.id === name1?.id && name2 && name3) return [name2, name3];
    if (selected.id === name2?.id && name1 && name3) return [name1, name3];
    if (selected.id === name3?.id && name1 && name2) return [name1, name2];
    return null;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      selectedIndex = 0;
    } else if (event.key === 'ArrowDown') {
      selectedIndex = 1;
    } else if (event.key === 'ArrowRight') {
      selectedIndex = 2;
    } else if (event.key === 'Enter' && selectedIndex !== null) {
      const selected = [name1, name2, name3][selectedIndex];
      if (selected) {
        const others = getOtherNames(selected);
        if (others) {
          onSelect(selected, others[0], others[1]);
        }
      }
      selectedIndex = null;
    }
  }

  function handleClick(name: Name): void {
    const others = getOtherNames(name);
    if (others) {
      onSelect(name, others[0], others[1]);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col gap-8">
  <h2 class="text-2xl font-semibold text-center text-slate-700">Which name do you prefer?</h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Name 1 -->
    <button
      onclick={() => name1 && handleClick(name1)}
      class="p-8 rounded-lg transition-all cursor-pointer {selectedIndex === 0
        ? 'ring-4 ring-blue-500 bg-blue-50'
        : 'bg-white hover:shadow-lg'} shadow-md"
    >
      <div class="text-5xl font-bold text-slate-900 mb-4">{name1?.text || ''}</div>
      <div class="text-sm text-slate-600">
        ELO: <span class="font-semibold">{name1?.eloRating || 0}</span>
      </div>
    </button>

    <!-- Name 2 -->
    <button
      onclick={() => name2 && handleClick(name2)}
      class="p-8 rounded-lg transition-all cursor-pointer {selectedIndex === 1
        ? 'ring-4 ring-blue-500 bg-blue-50'
        : 'bg-white hover:shadow-lg'} shadow-md"
    >
      <div class="text-5xl font-bold text-slate-900 mb-4">{name2?.text || ''}</div>
      <div class="text-sm text-slate-600">
        ELO: <span class="font-semibold">{name2?.eloRating || 0}</span>
      </div>
    </button>

    <!-- Name 3 -->
    <button
      onclick={() => name3 && handleClick(name3)}
      class="p-8 rounded-lg transition-all cursor-pointer {selectedIndex === 2
        ? 'ring-4 ring-blue-500 bg-blue-50'
        : 'bg-white hover:shadow-lg'} shadow-md"
    >
      <div class="text-5xl font-bold text-slate-900 mb-4">{name3?.text || ''}</div>
      <div class="text-sm text-slate-600">
        ELO: <span class="font-semibold">{name3?.eloRating || 0}</span>
      </div>
    </button>
  </div>

  <div class="text-center text-sm text-slate-500">
    Use arrow keys to select, Enter to confirm, or click directly
  </div>
</div>
