export type Theme = "system" | "light" | "dark";

export const THEME_COOKIE = "pfund-theme";

// the landing page is designed dark-first, so anything unknown (or no cookie) = dark
export const DEFAULT_THEME: Theme = "dark";

export function parseTheme(value: string | undefined): Theme {
  return value === "system" || value === "light" || value === "dark" ? value : DEFAULT_THEME;
}
