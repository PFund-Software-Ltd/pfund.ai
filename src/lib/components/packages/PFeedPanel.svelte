<script lang="ts">
  // pfeed tab
  import SplitPanel from "./SplitPanel.svelte";
  import PackageIntro from "./PackageIntro.svelte";
  import FeatureCode, { type Feature } from "./FeatureCode.svelte";

  // to add a feature: append one entry, it gets its own code block and a dot
  const FEATURES: Feature[] = [
    {
      name: "Backtest-ready data, from any provider",
      description:
        "Every provider's data comes out cleaned, with the same columns, so it's ready for backtesting. Switching provider means changing one line, not rewriting your pipeline.",
      file: "download.py",
      code: `import pfeed as pe

bybit = pe.Bybit()
feed = bybit.market_feed

result = feed.download(
    product="BTC_USDT_PERP",  # or BTC_USDT_PERPETUAL in full
    resolution="1minute",  # '1tick'/'1t' or '2second'/'2s' etc.
    start_date="2026-01-01",
    end_date="2026-01-01",
    io=pe.DuckLakeIO(),  # store it in your local data lakehouse
)
df = result.data.collect()`,
    },
    {
      name: "Live data, stored as it streams",
      description:
        "Stream real-time market data through the same interface, handle each message with your own callback, and store everything in your local data lakehouse as it arrives.",
      file: "stream.py",
      code: `import pfeed as pe

bybit = pe.Bybit()
feed = bybit.market_feed

feed.stream(
    product="BTC_USDT_CRYPTO",
    resolution="1tick",  # or just 'tick' for tick data
    # only DuckLake supports storing streamed data for now, set it to None to skip storing
    io=pe.DuckLakeIO(),
    callback=lambda msg: print(msg),
)`,
    },
  ];

  const REPO = "https://github.com/PFund-Software-Ltd/pfeed";
  const WEBSITE: string | null = "https://pfeed.pfund.ai";

  let active = $state(0);
</script>

<SplitPanel>
  {#snippet left()}
    <FeatureCode features={FEATURES} bind:active />
  {/snippet}
  {#snippet right()}
    <PackageIntro
      title="Any provider, your own data lakehouse"
      description="Download, stream and store market data from different providers through one API."
      install={'pip install "pfeed[bybit,ray]"'}
      repo={REPO}
      website={WEBSITE}
    >
      <!-- the active feature, explaining the code on the left (same stacking as PFundPanel) -->
      <div class="grid grid-cols-1">
        {#each FEATURES as feature, i (feature.name)}
          <div
            class="col-start-1 row-start-1 rounded-lg border-l-2 border-primary bg-background px-4 py-3 transition-[opacity,visibility] duration-200 {i === active ? 'opacity-100' : 'invisible opacity-0'}"
          >
            <p class="font-semibold">{feature.name}</p>
            <p class="mt-1 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        {/each}
      </div>
      {#snippet installNote()}
        <ul class="space-y-1">
          <li><code class="font-mono text-foreground">bybit</code>: your data source (a crypto exchange), swap in the one you need</li>
          <li><code class="font-mono text-foreground">ray</code>: parallel processing (recommended)</li>
        </ul>
      {/snippet}
    </PackageIntro>
  {/snippet}
</SplitPanel>
