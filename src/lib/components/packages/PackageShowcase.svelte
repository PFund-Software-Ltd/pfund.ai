<script lang="ts">
  // Tabbed showcase of the pfund ecosystem packages. TODO: placeholder copy/sizes
  // Each tab renders its own panel component, so panels can differ completely (layout, state, content).
  // To add a package: write its panel component, then add one entry to PACKAGES.
  import type { Component } from "svelte";
  import PFundPanel from "./PFundPanel.svelte";
  import PFeedPanel from "./PFeedPanel.svelte";

  type Package = {
    id: string; // package name, also the tab label
    role: string; // short label under the tab name
    panel: Component; // owns its own layout and copy
  };

  const PACKAGES: Package[] = [
    {
      id: "pfund",
      role: "Trade engine",
      panel: PFundPanel,
    },
    {
      id: "pfeed",
      role: "Data engine",
      panel: PFeedPanel,
    },
  ];

  const uid = $props.id(); // unique per instance, for tab ↔ panel aria ids
  let active = $state(0);
  const tabs: HTMLButtonElement[] = [];

  // ARIA tabs pattern: arrow keys move between tabs, Home/End jump to the ends
  function onkeydown(e: KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: PACKAGES.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    active = (keys[e.key] + PACKAGES.length) % PACKAGES.length; // wrap around
    tabs[active].focus();
  }
</script>

<!-- the panels are wider than the rest of the page; the heading and tabs keep the page width (max-w-380) so they line up with other sections -->
<section class="max-w-[118rem] mx-auto px-4 py-20 lg:py-36">
  <div class="max-w-380 mx-auto">
    <!-- TODO: placeholder copy -->
    <!-- eyebrow: same mono/primary style as the dial's "LEVEL 2 / 5" -->
    <p class="font-mono text-sm uppercase tracking-[0.2em] text-primary">Powered by open-source engines</p>
    <h2 class="mt-3 font-display text-[2rem] lg:text-[2.4rem] font-extrabold leading-[1.1] tracking-tight">
      One ecosystem, from data and ML models to AI trading
    </h2>
    <p class="mt-3 text-lg text-muted-foreground text-pretty">
      AlphaFund runs on the PFund ecosystem: <strong>free</strong>, <strong>open-source</strong> Python packages you can also use on their own.
    </p>

    <!-- only the active tab is in the tab order (roving tabindex); arrows move between tabs -->
    <div role="tablist" aria-label="Packages" tabindex="-1" class="mt-10 flex gap-8 border-b" {onkeydown}>
      {#each PACKAGES as pkg, i (pkg.id)}
        <button
          bind:this={tabs[i]}
          type="button"
          role="tab"
          id="{uid}-tab-{pkg.id}"
          aria-selected={i === active}
          aria-controls="{uid}-panel-{pkg.id}"
          tabindex={i === active ? 0 : -1}
          onclick={() => (active = i)}
          class="tab relative flex flex-col items-start rounded-md px-1 pb-3 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors hover:text-foreground aria-selected:text-foreground"
        >
          <span class="font-mono text-lg font-semibold">{pkg.id}</span>
          <span class="text-xs">{pkg.role}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- all panels stay mounted (not {#if}): switching tabs keeps each panel's state, and SSR renders them all.
       Same stacking as FeatureCode: every panel shares one grid cell, so the card is always as tall as the tallest
       package and doesn't jump on tab switch. `invisible` (not `hidden`) keeps inactive panels in the layout. -->
  <div class="mt-8 grid grid-cols-1">
    {#each PACKAGES as pkg, i (pkg.id)}
      <div
        role="tabpanel"
        id="{uid}-panel-{pkg.id}"
        aria-labelledby="{uid}-tab-{pkg.id}"
        class="relative col-start-1 row-start-1 rounded-3xl border bg-muted p-6 transition-[opacity,visibility] duration-200 lg:p-10 {i === active ? 'opacity-100' : 'invisible opacity-0'}"
      >
        <pkg.panel />
      </div>
    {/each}
  </div>
</section>

<style>
  /* active-tab underline, glowing like the dial's primary accents */
  .tab::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    bottom: -1px;
    height: 2px;
    background: var(--color-primary);
    box-shadow: 0 0 8px var(--color-primary);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .tab[aria-selected="true"]::after {
    opacity: 1;
  }
</style>
