<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold text-slate-900">Name Selector</h1>
      <p class="text-slate-600 mt-2">Find your perfect business name</p>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <slot />
  </main>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
