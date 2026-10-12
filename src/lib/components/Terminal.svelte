<script lang="ts">
  import Copy from "~icons/lucide/copy";
  import Check from "~icons/lucide/check";
  import type { Snippet } from "svelte";

  let {
    commands,
    pending,
  }: {
    commands: string[];
    pending?: Snippet; // shows the commands as still running: a spinner line with this text, and no copy button
  } = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(commands.join("\n"));
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div class="rounded-xl border bg-background">
  <div class="flex items-center justify-between border-b px-4 py-2 text-sm text-muted-foreground">
    <span>Terminal</span>
    {#if !pending}
      <button type="button" onclick={copy} aria-label="Copy commands" class="hover:text-foreground">
        {#if copied}
          <Check class="size-4" aria-hidden="true" />
        {:else}
          <Copy class="size-4" aria-hidden="true" />
        {/if}
      </button>
    {/if}
  </div>
  <pre class="overflow-x-auto p-4 font-mono font-medium"><code
      >{#each commands as command (command)}<span class="block"
          ><span class="select-none text-primary">$ </span>{command}</span
        >{/each}{#if pending}<span class="block text-muted-foreground"
            ><span class="spinner select-none text-primary" aria-hidden="true"></span> {@render pending()}</span
          >{/if}</code
    ></pre>
</div>

<style>
  /* braille spinner like CLI tools (pip, uv); pure CSS, so it also animates without JS */
  .spinner::before {
    content: "⠋";
    animation: spin 0.8s steps(1) infinite;
  }
  @keyframes spin {
    0% { content: "⠋"; }
    10% { content: "⠙"; }
    20% { content: "⠹"; }
    30% { content: "⠸"; }
    40% { content: "⠼"; }
    50% { content: "⠴"; }
    60% { content: "⠦"; }
    70% { content: "⠧"; }
    80% { content: "⠇"; }
    90% { content: "⠏"; }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner::before {
      animation: none;
    }
  }
</style>
