// Logos of the venues/data providers pfund + pfeed connect to. Shared by the logo marquee and (later) the package configurators.
// Logos are imported as raw SVG strings so they render inline: `currentColor` in the file then follows the theme.
import alpaca from "#lib/assets/logos/alpaca.svg?raw";
import binance from "#lib/assets/logos/binance.svg?raw";
import bybit from "#lib/assets/logos/bybit.svg?raw";
import databento from "#lib/assets/logos/databento.svg?raw";
import hyperliquid from "#lib/assets/logos/hyperliquid.svg?raw";
import okx from "#lib/assets/logos/okx.svg?raw";

export type Logo = {
  id: string;
  name: string;
  logo: string; // raw <svg> markup
  scale?: number; // optical size tweak, for heavy/bold logos that look big at equal area
};

export const LOGOS: Logo[] = [
  { id: "binance", name: "Binance", logo: binance },
  { id: "bybit", name: "Bybit", logo: bybit, scale: 0.7 },
  { id: "okx", name: "OKX", logo: okx, scale: 0.6 },
  { id: "hyperliquid", name: "Hyperliquid", logo: hyperliquid },
  { id: "alpaca", name: "Alpaca", logo: alpaca },
  { id: "databento", name: "Databento", logo: databento },
];
