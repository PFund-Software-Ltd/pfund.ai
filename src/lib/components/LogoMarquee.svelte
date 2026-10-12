<script lang="ts">
  // Infinite logo strip. TODO: placeholder sizes/speed/copy
  import { LOGOS } from "#lib/logos.ts";

  // Equal *area*, not equal height: a wide wordmark (Hyperliquid ~6:1) at the same height as a
  // compact one (Bybit ~3:1) looks twice as big. h = sqrt(area / aspect).
  const AREA = 4096; // px², ≈ 32px tall at 4:1
  const GAP = 64; // px between logos
  const SECONDS_PER_LOGO = 3; // keeps the speed constant as logos are added

  const aspect = (svg: string) => {
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)![1].split(/[\s,]+/).map(Number);
    return w / h;
  };
  const sized = LOGOS.map((it) => {
    const height = Math.sqrt(AREA / aspect(it.logo)) * (it.scale ?? 1);
    return { ...it, height, width: height * aspect(it.logo) };
  });

  // One "set" must be wider than the widest screen, or a gap shows before the loop restarts,
  // so repeat the list until a set holds at least MIN_PER_SET logos.
  const MIN_PER_SET = 12;
  const REPEAT = Math.ceil(MIN_PER_SET / sized.length);
  const set = Array.from({ length: REPEAT }, () => sized).flat();
</script>

{#snippet logoSet()}
  <!-- pr = gap, so the seam between the two sets is the same as between logos -->
  <ul class="flex shrink-0 items-center" style:gap="{GAP}px" style:padding-right="{GAP}px">
    {#each set as logo, i (i)}
      <li class="shrink-0 [&>svg]:size-full" style:width="{logo.width}px" style:height="{logo.height}px">
        {@html logo.logo}
      </li>
    {/each}
  </ul>
{/snippet}

<section class="max-w-380 mx-auto px-4 pt-12 lg:pt-28">
  <!-- bold headline, honest subline: not every logo is fully supported yet. TODO: "See integration status →" link once docs exist -->
  <h2 class="font-display text-center text-[2rem] lg:text-[2.4rem] font-extrabold leading-[1.1] tracking-tight text-foreground">One app to trade them all</h2>
  <p class="mt-3 text-center text-base text-muted-foreground">
    AlphaFund brings your exchanges, brokers and data providers together, with more added every release.
  </p>

  <!-- screen readers get the plain list once; the moving duplicates are hidden from them -->
  <ul class="sr-only">
    {#each LOGOS as it (it.id)}
      <li>{it.name}</li>
    {/each}
  </ul>

  <div class="marquee mt-6 overflow-hidden text-foreground" aria-hidden="true">
    <!-- two identical sets; sliding by exactly one set (-50%) lands on an identical frame, so the loop is seamless -->
    <div class="track flex w-max" style:--duration="{set.length * SECONDS_PER_LOGO}s">
      {@render logoSet()}
      {@render logoSet()}
    </div>
  </div>
</section>

<style>
  /* fade both edges so logos don't pop in/out at a hard line */
  .marquee {
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  }
  .track {
    animation: scroll var(--duration) linear infinite;
  }
  .marquee:hover .track {
    animation-play-state: paused;
  }
  @keyframes scroll {
    to {
      translate: -50%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none;
    }
  }
</style>
