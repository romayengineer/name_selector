<script lang="ts">
  interface Props {
    onGenerateMore: () => void;
    totalNames?: number;
  }

  const { onGenerateMore, totalNames = 0 }: Props = $props();

  let isGenerating = $state(false);

  async function handleGenerateMore(): Promise<void> {
    isGenerating = true;
    onGenerateMore();
    isGenerating = false;
  }
</script>

<div class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-lg shadow-md p-6">
  <div class="text-sm text-slate-600">
    Total names generated: <span class="font-semibold text-slate-900">{totalNames}</span>
  </div>

  <button
    onclick={handleGenerateMore}
    disabled={isGenerating}
    class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
  >
    {isGenerating ? 'Generating...' : 'Generate 100 More'}
  </button>
</div>
