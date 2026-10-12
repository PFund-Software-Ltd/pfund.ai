<script lang="ts">
  // Optional two-column layout for package panels; stacks on mobile.
  // A panel that needs a different layout just doesn't use it.
  import type { Snippet } from "svelte";

  let { left, right }: { left: Snippet; right: Snippet } = $props();
</script>

<div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
  <!-- min-w-0: lets wide content (code) scroll instead of stretching the grid -->
  <div class="min-w-0">{@render left()}</div>
  <!-- on mobile the right column (the copy) stacks above the code, so readers get the pitch first -->
  <div class="min-w-0 max-lg:order-first">{@render right()}</div>
</div>
