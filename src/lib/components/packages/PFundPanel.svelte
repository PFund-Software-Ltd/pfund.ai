<script lang="ts">
  // pfund tab. TODO: placeholder copy and code (pfund API not finalized)
  import SplitPanel from "./SplitPanel.svelte";
  import PackageIntro from "./PackageIntro.svelte";
  import FeatureCode, { type Feature } from "./FeatureCode.svelte";

  // to add a feature: append one entry, it gets its own code block and a dot
  const FEATURES: Feature[] = [
    {
      name: "Backtest to live, no rewrite",
      description: "Swap one line to take a backtested strategy live.",
      file: "strategy.py",
      code: `import pfund as pf

class MyStrategy(pf.Strategy):
    def trade(self, X):
        fast = X["close"].rolling(10).mean().iloc[-1]
        slow = X["close"].rolling(30).mean().iloc[-1]
        if fast > slow and not self.position:
            return [self.create_order(side=1, quantity=1)]
        return []

engine = pf.BacktestEngine()  # pf.TradeEngine() to go live
strategy = engine.add_strategy(MyStrategy())
strategy.add_data("ibkr", "AAPL_USD_STK", resolutions=["1d"])
engine.run()`,
    },
    {
      name: "Vectorized backtesting in one chain",
      description:
        "Define signals, entries and exits on a pandas or Polars dataframe, then backtest the whole history at once. No per-bar loop.",
      file: "strategy.py",
      code: `import pfund as pf
import polars as pl

class SMACross(pf.Strategy):
    def backtest(self, df: pl.DataFrame) -> pl.DataFrame:
        fast = df["close"].rolling_mean(10)
        slow = df["close"].rolling_mean(30)
        return (
            df.create_signal(buy_condition=fast > slow, sell_condition=fast < slow)
            .open_position(order_quantity=1)
            .close_position(stop_loss=0.05, take_profit=0.1)
            .backtest()
        )

engine = pf.BacktestEngine(mode="vectorized", data_range="1y")
strategy = engine.add_strategy(SMACross())
strategy.add_data("bybit", "BTC_USDT_PERP", resolutions=["1d"])
engine.run()`,
    },
  ];

  const REPO = "https://github.com/PFund-Software-Ltd/pfund";
  const WEBSITE: string | null = "https://pfund.pfund.ai";

  let active = $state(0);
</script>

<SplitPanel>
  {#snippet left()}
    <FeatureCode features={FEATURES} bind:active />
  {/snippet}
  {#snippet right()}
    <PackageIntro
      title="Write once, trade anywhere"
      description="Backtest and trade live with the same code, on any venue pfund connects to."
      install='pip install "pfund[core,torch]"'
      repo={REPO}
      website={WEBSITE}
    >
      <!-- the active feature, explaining the code on the left.
           Same stacking as FeatureCode: every card shares one grid cell, so a longer description doesn't shift the layout. -->
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
