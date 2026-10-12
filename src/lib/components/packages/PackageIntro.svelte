<script lang="ts">
  // Marketing copy + install command for a package panel. TODO: placeholder sizes
  import Terminal from "#lib/components/Terminal.svelte";
  import GitHub from "~icons/simple-icons/github";
  import ArrowUpRight from "~icons/lucide/arrow-up-right";

  import type { Snippet } from "svelte";

  let {
    title,
    description,
    install,
    repo,
    children,
  }: {
    title: string;
    description: string;
    install: string;
    repo: string;
    children?: Snippet; // optional extras between the copy and the install command, e.g. the active feature card
  } = $props();
</script>

<div class="flex h-full flex-col justify-center gap-6">
  <!-- pinned to the card's top-right corner (the tabpanel in PackageShowcase is `relative`) -->
  <a
    href={repo}
    target="_blank"
    rel="noreferrer"
    class="group absolute right-4 top-4 flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 font-mono text-sm text-muted-foreground outline-none transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:right-5 lg:top-5"
  >
    <GitHub class="size-4" aria-hidden="true" />
    GitHub
    <!-- external-link arrow nudges up-right on hover -->
    <ArrowUpRight
      class="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
      aria-hidden="true"
    />
  </a>
  <div>
    <h3 class="text-2xl font-bold">{title}</h3>
    <p class="mt-2 text-lg text-muted-foreground text-pretty">{description}</p>
  </div>
  {@render children?.()}
  <Terminal commands={[install]} />
</div>
