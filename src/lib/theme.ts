export type Theme = "system" | "light" | "dark";

export const THEME_COOKIE = "theme";

// anything unknown (or no cookie) = system
export function parseTheme(value: string | undefined): Theme {
  return value === "light" || value === "dark" ? value : "system";
}
