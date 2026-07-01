<script lang="ts">
  import type { Name } from '$lib/types/index';

  interface Props {
    name1?: Name;
    name2?: Name;
    onSelect: (winner: Name) => void;
  }

  const { name1, name2, onSelect }: Props = $props();

  let selectedIndex: number | null = $state(null);

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      selectedIndex = 0;
    } else if (event.key === 'ArrowRight') {
      selectedIndex = 1;
    } else if (event.key === 'Enter' && selectedIndex !== null) {
      if (selectedIndex === 0 && name1) {
        onSelect(name1);
      } else if (selectedIndex === 1 && name2) {
        onSelect(name2);
      }
      selectedIndex = null;
    }
  }

  function handleClick(name: Name): void {
    onSelect(name);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col gap-8">
  <h2 class="text-2xl font-semibold text-center text-slate-700">Which name do you prefer?</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  </div>

  <div class="text-center text-sm text-slate-500">
    Use arrow keys to select, Enter to confirm, or click directly
  </div>
</div>
