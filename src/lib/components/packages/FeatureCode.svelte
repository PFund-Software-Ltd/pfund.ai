<script lang="ts" module>
  // A package's killer features, one code block each, switched with arrows (shown on hover) or dots.
  export type Feature = {
    name: string;
    description: string;
    file: string; // file name shown in the code block header
    code: string;
  };
</script>

<script lang="ts">
  import ChevronLeft from "~icons/lucide/chevron-left";
  import ChevronRight from "~icons/lucide/chevron-right";
  import CodeBlock from "./CodeBlock.svelte";

  let { features, active = $bindable(0) }: { features: Feature[]; active?: number } = $props();

  function step(by: number) {
    active = (active + by + features.length) % features.length; // wrap around
  }
</script>

<!-- all code blocks render during SSR (not {#if}), so every highlight is in the page and switching never waits on the server.
     They're stacked in one grid cell, so the box is always as tall as the longest snippet and doesn't jump on switch.
     grid-cols-1 = minmax(0, 1fr): without it the column grows to the longest code line and spills over the RHS. -->
<div class="group relative grid grid-cols-1">
  {#each features as feature, i (feature.name)}
    <!-- `invisible` (not `hidden`) keeps inactive blocks in the layout but out of view, the tab order and screen readers -->
    <div
      class="col-start-1 row-start-1 transition-[opacity,visibility] duration-200 {i === active ? 'opacity-100' : 'invisible opacity-0'}"
    >
      <CodeBlock file={feature.file} code={feature.code} />
    </div>
  {/each}

  {#if features.length > 1}
    <!-- hidden until hover/focus; always shown on touch screens, which can't hover -->
    {#each [{ by: -1, label: "Previous feature", Icon: ChevronLeft, side: "left-2" }, { by: 1, label: "Next feature", Icon: ChevronRight, side: "right-2" }] as arrow (arrow.by)}
      <button
        type="button"
        aria-label={arrow.label}
        onclick={() => step(arrow.by)}
        class="absolute top-1/2 {arrow.side} grid size-9 -translate-y-1/2 place-items-center rounded-full border bg-background/80 text-muted-foreground opacity-0 outline-none backdrop-blur transition hover:border-primary/50 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 pointer-coarse:opacity-100"
      >
        <arrow.Icon class="size-5" aria-hidden="true" />
      </button>
    {/each}
  {/if}
</div>

{#if features.length > 1}
  <div class="mt-4 flex justify-center gap-2">
    {#each features as feature, i (feature.name)}
      <button
        type="button"
        aria-label="Show {feature.name}"
        aria-current={i === active}
        onclick={() => (active = i)}
        class="h-1.5 w-4 rounded-full bg-border outline-none transition-all hover:bg-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:w-8 aria-[current=true]:bg-primary"
      ></button>
    {/each}
  </div>
{/if}
