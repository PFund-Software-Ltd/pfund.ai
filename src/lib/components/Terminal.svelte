<script lang="ts">
  import Copy from "~icons/lucide/copy";
  import Check from "~icons/lucide/check";

  let { commands }: { commands: string[] } = $props();

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
    <button type="button" onclick={copy} aria-label="Copy commands" class="hover:text-foreground">
      {#if copied}
        <Check class="size-4" aria-hidden="true" />
      {:else}
        <Copy class="size-4" aria-hidden="true" />
      {/if}
    </button>
  </div>
  <pre class="overflow-x-auto p-4 font-mono font-medium"><code
      >{#each commands as command (command)}<span class="block"
          ><span class="select-none text-primary">$ </span>{command}</span
        >{/each}</code
    ></pre>
</div>
