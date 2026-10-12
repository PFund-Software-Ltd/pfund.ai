<script lang="ts">
  // pfeed tab. TODO: placeholder copy and code (pfeed API not finalized)
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
    "BTC_USDT_PERP",
    resolution="1m",
    start_date="2024-01-01",
    io=pe.DuckLakeIO(),  # store it in your local data lakehouse
)
df = result.data  # backtest-ready data`,
    },
    {
      name: "Data pipelines with your own functions",
      description:
        "Chain download, transform and load into one pipeline. Plug in any Python function to shape the data, then save the result to your lakehouse.",
      file: "pipeline.py",
      code: `import pfeed as pe
import polars as pl

def add_returns(df: pl.LazyFrame) -> pl.LazyFrame:
    return df.with_columns(pl.col("close").pct_change().alias("returns"))

bybit = pe.Bybit(pipeline_mode=True)
feed = bybit.market_feed
result = (
    feed
    .download("BTC_USDT_PERP", resolution="1m", start_date="2024-01-01")
    .transform(add_returns)  # your own function
    .load(pe.DuckLakeIO(), data_layer="curated")
    .run()
)`,
    },
  ];

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
      install="pip install pfeed"
      repo="https://github.com/PFund-Software-Ltd/pfeed"
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
    </PackageIntro>
  {/snippet}
</SplitPanel>
