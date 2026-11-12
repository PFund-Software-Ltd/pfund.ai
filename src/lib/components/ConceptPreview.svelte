<script lang="ts">
  // Pre-launch stand-in for the AlphaFund demo video: a scripted, looping mock of the
  // strategy → agent → you approval chain. Pure CSS animation, the buttons are not interactive.
  // TODO: placeholder copy (strategy, trade, agent reasoning)
  const STRATEGY = "momentum_btc";
  const ORDER = "BUY 0.5 BTC";
  const AGENT_OPINION = "Volume is thin right now and the price just spiked. I'd halve the size to limit risk.";
  const AGENT_SUGGESTION = "BUY 0.25 BTC";
</script>

<!-- lg:self-stretch: fill the hero row (the grid centers items) so it matches the LHS height -->
<figure class="flex flex-col rounded-xl border bg-background lg:self-stretch">
  <div class="flex items-center justify-between border-b px-4 py-2 text-sm text-muted-foreground">
    <span>AlphaFund · concept preview</span>
    <span class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
      <span class="live-dot size-2 rounded-full bg-primary" aria-hidden="true"></span>
      in development
    </span>
  </div>

  <!-- flex-1 + justify-evenly: the steps spread out to fill the taller box (gap-6 = minimum spacing on mobile) -->
  <ol class="flex flex-1 flex-col justify-evenly gap-6 p-6 lg:p-10" aria-hidden="true">
    <!-- 1. the strategy pauses and asks for approval -->
    <li class="step step-strategy">
      <p class="label">▸ Strategy <span class="text-foreground normal-case tracking-normal">{STRATEGY}</span></p>
      <p class="mt-1.5">wants to <span class="font-mono font-semibold text-primary">{ORDER}</span></p>
      <p class="mt-1 text-sm text-muted-foreground">⏸ paused, waiting for approval</p>
    </li>

    <!-- 2. the agent adds its opinion (typing dots first, then the message in the same spot) -->
    <li class="step step-agent">
      <p class="label">◆ Agent <span class="text-foreground normal-case tracking-normal">trader</span></p>
      <div class="mt-1.5 grid">
        <span class="typing col-start-1 row-start-1 flex gap-1 self-start py-2" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
        <div class="reply col-start-1 row-start-1">
          <p class="text-pretty">“{AGENT_OPINION}”</p>
          <p class="mt-1 text-sm text-muted-foreground">
            suggests <span class="font-mono font-semibold text-primary">{AGENT_SUGGESTION}</span>
          </p>
        </div>
      </div>
    </li>

    <!-- 3. you make the final call -->
    <li class="step step-you">
      <p class="label">● You</p>
      <div class="mt-2 flex flex-wrap gap-2 text-sm font-medium">
        <span class="glow rounded-lg bg-primary px-3 py-1.5 text-primary-foreground">Approve 0.25</span>
        <span class="rounded-lg border px-3 py-1.5">Approve 0.5</span>
        <span class="rounded-lg border px-3 py-1.5">Reject</span>
      </div>
      <p class="mt-2 text-sm text-muted-foreground">waiting for you…</p>
    </li>
  </ol>

  <!-- screen readers get the caption instead of the animated mock -->
  <figcaption class="sr-only">
    Concept preview: a strategy asks to place an order, the AI agent adds its opinion and suggests a smaller size, and
    you make the final call.
  </figcaption>
</figure>

<style>
  .label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--muted-foreground);
  }

  /* one 12s loop: strategy at 0s → agent typing at ~1.5s → reply at ~3s → you at ~4.5s → hold → fade out */
  .step {
    animation: 12s ease-out infinite both;
  }
  .step-strategy {
    animation-name: show-strategy;
  }
  .step-agent {
    animation-name: show-agent;
  }
  .step-you {
    animation-name: show-you;
  }
  .reply {
    animation: show-reply 12s ease-out infinite both;
  }
  .typing {
    opacity: 0; /* only ever visible mid-animation */
    animation: show-typing 12s infinite both;
  }

  @keyframes show-strategy {
    0% { opacity: 0; transform: translateY(6px); }
    4%, 90% { opacity: 1; transform: none; }
    96%, 100% { opacity: 0; }
  }
  @keyframes show-agent {
    0%, 12% { opacity: 0; transform: translateY(6px); }
    16%, 90% { opacity: 1; transform: none; }
    96%, 100% { opacity: 0; }
  }
  @keyframes show-typing {
    0%, 14% { opacity: 0; }
    16%, 25% { opacity: 1; }
    26%, 100% { opacity: 0; }
  }
  @keyframes show-reply {
    0%, 26% { opacity: 0; }
    29%, 100% { opacity: 1; } /* the parent step handles the fade out */
  }
  @keyframes show-you {
    0%, 37% { opacity: 0; transform: translateY(6px); }
    41%, 90% { opacity: 1; transform: none; }
    96%, 100% { opacity: 0; }
  }

  /* typing dots bounce one after another */
  .typing span {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--muted-foreground);
    animation: bounce 0.9s ease-in-out infinite;
  }
  .typing span:nth-child(2) {
    animation-delay: 0.15s;
  }
  .typing span:nth-child(3) {
    animation-delay: 0.3s;
  }
  @keyframes bounce {
    0%, 60%, 100% { transform: none; opacity: 0.4; }
    30% { transform: translateY(-3px); opacity: 1; }
  }

  /* the suggested choice glows, nudging "your call" */
  .glow {
    animation: glow 1.6s ease-in-out infinite;
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    50% { box-shadow: 0 0 14px 2px color-mix(in oklch, var(--primary) 60%, transparent); }
  }

  .live-dot {
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    50% { opacity: 0.35; }
  }

  /* reduced motion: show the finished state as a still picture */
  @media (prefers-reduced-motion: reduce) {
    .step,
    .reply,
    .glow,
    .live-dot {
      animation: none;
    }
    .typing {
      display: none;
    }
  }
</style>
