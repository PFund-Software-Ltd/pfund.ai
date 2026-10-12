<script lang="ts">
  // Editor-style code block: file name header + copy button, highlighted on the server.
  import Copy from "~icons/lucide/copy";
  import Check from "~icons/lucide/check";
  import { highlight } from "#lib/highlight.remote.ts";

  let { file, code }: { file: string; code: string } = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<!-- h-full: fills the stack in FeatureCode, so shorter snippets get the same box -->
<div class="h-full rounded-xl border bg-background">
  <div class="flex items-center justify-between border-b px-4 py-2 text-sm text-muted-foreground">
    <span class="font-mono">{file}</span>
    <button type="button" onclick={copy} aria-label="Copy code" class="hover:text-foreground">
      {#if copied}
        <Check class="size-4" aria-hidden="true" />
      {:else}
        <Copy class="size-4" aria-hidden="true" />
      {/if}
    </button>
  </div>
  <!-- shiki returns a full <pre class="shiki">…</pre>; styled below -->
  <div class="code">{@html await highlight(code)}</div>
</div>

<style>
  .code :global(pre) {
    /* every code block is 20 lines tall (pfund's longest snippet is 18, plus room for a horizontal scrollbar),
       so all package panels share one height; shorter code leaves blank space, longer code scrolls inside the block */
    height: calc(20lh + 2rem);
    overflow: auto;
    padding: 1rem;
    font-family: var(--font-mono);
    font-size: 1rem;
    line-height: 1.625;
    background: transparent !important; /* use the block's background, not the theme's */
  }
</style>
