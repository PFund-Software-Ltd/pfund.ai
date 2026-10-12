<script lang="ts">
  // Marketing copy + install command for a package panel. TODO: placeholder sizes
  import Terminal from "#lib/components/Terminal.svelte";
  import GitHub from "~icons/simple-icons/github";
  import Globe from "~icons/lucide/globe";
  import ArrowUpRight from "~icons/lucide/arrow-up-right";

  import type { Component, Snippet } from "svelte";

  let {
    title,
    description,
    install,
    repo,
    website = null,
    children,
  }: {
    title: string;
    description: string;
    install: string;
    repo: string;
    website?: string | null; // the package's own project website; null = no button
    children?: Snippet; // optional extras between the copy and the install command, e.g. the active feature card
  } = $props();
</script>

{#snippet link(href: string, label: string, Icon: Component)}
  <a
    {href}
    target="_blank"
    rel="noreferrer"
    class="group flex items-center gap-2.5 rounded-xl border bg-background px-4 py-2 font-mono text-base text-muted-foreground outline-none transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
  >
    <Icon class="size-5" aria-hidden="true" />
    {label}
    <!-- external-link arrow nudges up-right on hover -->
    <ArrowUpRight
      class="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
      aria-hidden="true"
    />
  </a>
{/snippet}

<div class="flex h-full flex-col justify-center gap-6">
  <!-- links pinned to the card's top-right corner (the tabpanel in PackageShowcase is `relative`) -->
  <div class="absolute right-4 top-4 flex items-center gap-3 lg:right-6 lg:top-6">
    {#if website}
      {@render link(website, "Website", Globe)}
    {/if}
    {@render link(repo, "GitHub", GitHub)}
  </div>
  <div>
    <h3 class="text-2xl font-bold">{title}</h3>
    <p class="mt-2 text-lg text-muted-foreground text-pretty">{description}</p>
  </div>
  {@render children?.()}
  <Terminal commands={[install]} />
</div>
