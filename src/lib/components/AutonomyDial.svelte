<script lang="ts">
  // AutonomyLevel (0–5) as a HUD dial. TODO: placeholder colours/sizes/timings
  import { Spring } from "svelte/motion";

  const LEVELS = [
    { name: "Manual Trading", desc: "You do everything: research, decide, and place every order yourself." },
    { name: "Trading Copilot", desc: "AI assists: surfaces ideas and writes your algo-trading strategies. Once live, the algo follows your rules. AI makes no trading calls." },
    { name: "Human in the Loop", desc: "AI makes the trading decisions, but you're still the supervisor: approve each order, or keep watching and step in whenever needed." },
    { name: "Human on Call", desc: "AI trades on its own, but expects you to take over whenever it asks." },
    { name: "High Automation", desc: "AI runs on its own and handles its own emergencies. Under extreme conditions, such as thin liquidity, a broken trading API, or a lost connection, it pauses trading safely by itself and lets you know." },
    { name: "Full Automation", desc: "AI trades under any circumstances. No human needed." },
  ];
  const MAX = LEVELS.length - 1;
  const TARGET = 2; // AlphaFund is working toward this level, not there yet
  const PROGRESS = 0.6; // how far along TARGET's arc to fill. TODO: placeholder

  const C = 150; // svg centre
  const R = 112; // arc radius
  const SPAN = 45; // degrees per level (6 × 45 = 270° gauge)
  const START = -135; // 0° = 12 o'clock, clockwise
  const TICK_STEP = 5;
  const TICKS = (SPAN * LEVELS.length) / TICK_STEP + 1;

  let level = $state(0);

  // polar → svg coords
  const point = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: C + r * Math.sin(rad), y: C - r * Math.cos(rad) };
  };
  const arc = (i: number) => {
    const a = point(START + i * SPAN + 2.5, R);
    const b = point(START + (i + 1) * SPAN - 2.5, R);
    return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
  };

  // needle springs to the centre of the active segment
  const needle = new Spring(START, { stiffness: 0.08, damping: 0.35 });
  $effect(() => {
    needle.target = START + level * SPAN + SPAN / 2;
  });

  // scramble/decode the centre label
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  let label = $state("L0");
  $effect(() => {
    const target = `L${level}`;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      label =
        frame >= 8
          ? target
          : target
              .split("")
              .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
              .join("");
      if (frame >= 8) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  });

  // typewriter caption
  let typed = $state("");
  $effect(() => {
    const text = LEVELS[level].desc;
    let i = 0;
    typed = "";
    const id = setInterval(() => {
      typed = text.slice(0, ++i);
      if (i >= text.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  });

  // boot sequence: sweep 0 → MAX when scrolled into view, then settle on TARGET
  let timers: ReturnType<typeof setTimeout>[] = [];
  const cancelBoot = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  function boot(node: HTMLElement) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        for (let i = 0; i <= MAX; i++) timers.push(setTimeout(() => (level = i), i * 280));
        timers.push(setTimeout(() => (level = TARGET), (MAX + 1) * 280 + 500));
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelBoot();
    };
  }

  // user takes over: stop the boot sweep from overriding their pick
  const select = (i: number) => {
    cancelBoot();
    level = i;
  };
</script>

<!-- full-bleed band: separates the hero from the sections below. TODO: placeholder spacing -->
<section class="relative scheme-dark bg-muted text-foreground border-b border-foreground/10 mt-20 lg:mt-36" {@attach boot}>
  <!-- glowing top edge: a soft seam from the hero instead of a hard cut -->
  <div class="seam-line absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-primary to-transparent"></div>
  <!-- glow spills down into the band only, so it reads the same on a light or dark page -->
  <div class="seam-glow pointer-events-none absolute inset-x-0 top-0 h-24"></div>
  <div class="max-w-380 mx-auto px-12 py-10 lg:px-20 lg:py-12 grid gap-8 lg:gap-16 lg:grid-cols-[auto_1fr] lg:items-center">
    <!-- dial -->
    <svg viewBox="0 0 300 300" class="w-full max-w-sm mx-auto lg:w-96" role="group" aria-label="Autonomy level dial">
      <!-- outer rotating rings -->
      <circle cx={C} cy={C} r="142" fill="none" class="stroke-primary/40 spin" stroke-width="1" stroke-dasharray="2 8" />
      <circle cx={C} cy={C} r="134" fill="none" class="stroke-foreground/15 spin-rev" stroke-width="1" stroke-dasharray="40 14 4 14" />

      <!-- tick marks -->
      {#each { length: TICKS }, t (t)}
        {@const outer = point(START + t * TICK_STEP, 124)}
        {@const inner = point(START + t * TICK_STEP, t % (SPAN / TICK_STEP) === 0 ? 118 : 121)}
        <line
          x1={outer.x}
          y1={outer.y}
          x2={inner.x}
          y2={inner.y}
          class="stroke-foreground/25"
          stroke-width="1"
        />
      {/each}

      <!-- level segments -->
      {#each LEVELS as lv, i (i)}
        {@const p = point(START + i * SPAN + SPAN / 2, 92)}
        <path
          d={arc(i)}
          fill="none"
          stroke-width="14"
          stroke-linecap="round"
          class="seg {i <= level && !(i === TARGET && level === TARGET) ? 'stroke-primary on' : 'stroke-foreground/10'} {i === level ? 'active' : ''}"
        />
        {#if i === TARGET && level === TARGET}
          <!-- partial fill only when TARGET is selected; higher levels draw it full so the arc stays continuous -->
          {@const head = point(START + i * SPAN + 2.5 + (SPAN - 5) * PROGRESS, R)}
          <path
            d={arc(i)}
            fill="none"
            stroke-width="14"
            stroke-linecap="round"
            pathLength="1"
            stroke-dasharray="{PROGRESS} 1"
            class="seg stroke-primary on pointer-events-none {i === level ? 'active' : ''}"
          />
          <circle cx={head.x} cy={head.y} r="3" class="fill-foreground glow head pointer-events-none" />
        {/if}
        <!-- invisible, larger hit target -->
        <path
          d={arc(i)}
          fill="none"
          stroke="transparent"
          stroke-width="34"
          class="cursor-pointer outline-none focus-visible:stroke-primary/20"
          role="button"
          tabindex="0"
          aria-label="Level {i}: {lv.name}"
          onclick={() => select(i)}
          onkeydown={(e) => (e.key === "Enter" || e.key === " ") && select(i)}
        />
        <text
          x={p.x}
          y={p.y}
          text-anchor="middle"
          dominant-baseline="middle"
          class="font-mono text-[11px] pointer-events-none {i <= level ? 'fill-foreground' : 'fill-muted-foreground'}"
        >
          {i}
        </text>
      {/each}

      <!-- needle -->
      <g transform="rotate({needle.current} {C} {C})">
        <line x1={C} y1={C} x2={C} y2={C - 76} class="stroke-primary" stroke-width="2" stroke-linecap="round" />
        <circle cx={C} cy={C - 76} r="3" class="fill-primary glow" />
      </g>
      <circle cx={C} cy={C} r="46" class="fill-muted stroke-foreground/15" stroke-width="1" />

      <!-- centre readout -->
      <text x={C} y={C - 4} text-anchor="middle" dominant-baseline="middle" class="font-mono font-bold text-[28px] fill-foreground">
        {label}
      </text>
      <text x={C} y={C + 22} text-anchor="middle" class="font-mono text-[8px] tracking-[0.2em] fill-muted-foreground">
        {level === TARGET ? "IN PROGRESS" : "AUTONOMY"}
      </text>
    </svg>

    <!-- readout -->
    <div class="flex flex-col gap-4">
      <h2 class="font-display text-[2rem] lg:text-[2.4rem] font-extrabold leading-[1.1] tracking-tight">
        Autonomy levels in AI trading
      </h2>
      <p class="font-mono text-sm tracking-[0.2em] text-primary">LEVEL {level} / {MAX}</p>
      <p class="text-lg text-muted-foreground text-pretty">
        Levels measure who makes the judgment calls, not whether orders fire automatically.
      </p>
      <div class="min-h-24">
        <p class="flex flex-wrap items-center gap-3 text-2xl font-bold">
          {LEVELS[level].name}
          {#if level === TARGET}
            <span class="rounded-full border border-primary/50 px-3 py-0.5 font-mono text-xs font-normal text-primary">
              AlphaFund is getting here
            </span>
          {/if}
        </p>
        <p class="mt-2 text-xl text-muted-foreground text-pretty">
          {typed}<span class="caret">▍</span>
        </p>
      </div>

      <!-- ai ↔ you split -->
      <div class="flex flex-col gap-2 font-mono text-xs text-muted-foreground">
        <div class="flex justify-between"><span>AI</span><span>YOU</span></div>
        <div class="h-2 rounded-full bg-foreground/10 overflow-hidden">
          <div class="h-full bg-primary glow transition-[width] duration-700" style:width="{(level / MAX) * 100}%"></div>
        </div>
      </div>

      <p class="text-xs text-muted-foreground lg:text-right mt-4">
        Levels adapted from the
        <a
          href="https://www.sae.org/standards/content/j3016_202104/"
          target="_blank"
          rel="noreferrer"
          class="underline underline-offset-4 hover:text-foreground">SAE J3016 levels of driving automation</a
        >, the scale used for self-driving cars.
      </p>
    </div>
  </div>
</section>

<style>
  .spin,
  .spin-rev {
    transform-box: fill-box;
    transform-origin: center;
    animation: spin 24s linear infinite;
  }
  .spin-rev {
    animation-duration: 40s;
    animation-direction: reverse;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .seg {
    transition:
      stroke 300ms,
      filter 300ms;
  }
  /* tight bloom so the line reads as the light source; drop-shadow follows the gradient's fade */
  .seam-line {
    filter: drop-shadow(0 0 2px var(--primary)) drop-shadow(0 0 6px var(--primary));
  }
  .seam-glow {
    background: radial-gradient(ellipse 35% 100% at 50% 0%, color-mix(in oklch, var(--primary) 22%, transparent), transparent);
  }

  .seg.on,
  .glow {
    filter: drop-shadow(0 0 6px var(--primary));
  }
  .seg.active {
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      filter: drop-shadow(0 0 14px var(--primary));
    }
  }

  .head {
    transform-box: fill-box;
    transform-origin: center;
    animation: breathe 1.4s ease-in-out infinite;
  }
  @keyframes breathe {
    50% {
      opacity: 0.4;
      transform: scale(1.6);
    }
  }

  .caret {
    animation: blink 1s steps(1) infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spin,
    .spin-rev,
    .seg.active,
    .head,
    .caret {
      animation: none;
    }
  }
</style>
