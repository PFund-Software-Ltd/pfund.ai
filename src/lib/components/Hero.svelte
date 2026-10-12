<script lang="ts">
  import type { Component } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import alphafundLogo from "#lib/assets/logos/alphafund.svg";
  import Github from "~icons/simple-icons/github";
  import Discord from "~icons/simple-icons/discord";
  import ChevronRight from "~icons/lucide/chevron-right";
  import Star from "~icons/lucide/star";
  import Terminal from "./Terminal.svelte";
  import ConceptPreview from "./ConceptPreview.svelte";
  import { ALPHAFUND_READY } from "#lib/config.ts";

  const GITHUB_URL = "https://github.com/PFund-Software-Ltd/AlphaFund";
  const DISCORD_URL = "https://discord.gg/vqpS94tpdp";
</script>

{#snippet pill(href: string, Icon: Component<SvelteHTMLElements["svg"]>, label: string)}
  <a
    {href}
    target="_blank"
    rel="noreferrer"
    class="flex items-center gap-2 rounded-full bg-foreground/10 px-5 py-3 font-medium hover:bg-foreground/15"
  >
    <Icon class="size-5" aria-hidden="true" />
    <span>{label}</span>
    <ChevronRight class="size-4 text-muted-foreground" aria-hidden="true" />
  </a>
{/snippet}

<section class="max-w-380 mx-auto px-4 pb-4 pt-16 lg:pt-32">
  <!--
    always-dark card: tokens use light-dark(), so color-scheme:dark flips them to dark values here.
    bg-muted (not bg-background) so the card still stands out from the page in dark mode.
    TODO: placeholder padding/radius
  -->
  <div
    class="scheme-dark bg-muted text-foreground rounded-3xl p-8 lg:p-16 grid gap-12 lg:grid-cols-2 lg:items-center"
  >
    <!-- LHS -->
    <div class="flex flex-col gap-6">
      <img src={alphafundLogo} alt="AlphaFund" class="h-28 w-auto self-start -mb-4" />

      <h1 class="font-display text-[2.8rem] lg:text-[3.6rem] font-extrabold leading-[1.1] tracking-tight text-balance">
        The AI trading community building in the open
      </h1>
      <!-- grouped so they get their own smaller gap instead of the column's gap-6 -->
      <div class="flex flex-col gap-1">
        <p class="text-xl lg:text-2xl text-muted-foreground text-pretty font-medium">
          {#if ALPHAFUND_READY}
            Try AlphaFund — run your own AI-powered fund.
          {:else}
            Coming soon — run your own AI-powered fund.
          {/if}
        </p>
        <p class="text-xl lg:text-2xl text-pretty font-bold">Be Your Own Fund Manager.</p>
      </div>

      <div class="flex flex-wrap gap-4">
        {@render pill(GITHUB_URL, Github, "GitHub")}
        {@render pill(DISCORD_URL, Discord, "Discord")}
      </div>

      {#if ALPHAFUND_READY}
        <Terminal commands={["pip install alphafund", "alpha run"]} />
      {:else}
        <!-- pre-launch: no command (nothing installable yet), just a spinner that reads as "still being built" -->
        <Terminal commands={[]}>
          {#snippet pending()}
            building alphafund… in development
            <!-- pl-[2ch]: lines up under the text, past the spinner + space -->
            <!-- the call to action: links to the repo; the star fills on hover -->
            <span class="block pl-[2ch]"
              ><a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                class="group rounded-sm text-foreground underline decoration-primary/50 underline-offset-4 outline-none transition-colors hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring"
                ><Star
                  class="inline size-4 align-[-0.125em] text-primary transition-[fill] group-hover:fill-current"
                  aria-hidden="true"
                /> star on GitHub to get notified</a
              ></span
            >
          {/snippet}
        </Terminal>
      {/if}
    </div>

    <!-- RHS -->
    {#if !ALPHAFUND_READY}
      <ConceptPreview />
    {:else}
      <div class="grid aspect-video place-items-center border">
        <!--
          TODO: replace with AlphaFund demo, use <video> not GIF
          (GIF: ~10x larger, 256 colours, no pause/scrub)
          <video autoplay muted loop playsinline poster={...}>
            <source src={...} type="video/webm" />
            <source src={...} type="video/mp4" />
          </video>
          - muted: required for autoplay
          - playsinline: stops iOS forcing fullscreen
          - poster: still frame shown while loading
          - webm first (smaller), mp4 (H.264) as fallback
        -->
        <p>AlphaFund demo coming soon</p>
      </div>
    {/if}
  </div>
</section>
