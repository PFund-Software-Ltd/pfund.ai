// Links shared by the navbar and the footer. Import via `#lib/links.ts`.

export type Resource = {
  label: string;
  href: string;
  description: string; // shown in the navbar dropdown only; the footer just lists labels
};

// order = display order in both the navbar dropdown and the footer column
// TODO: placeholder descriptions
export const RESOURCES: Resource[] = [
  {
    label: "alphafund",
    href: "https://alphafund.pfund.ai",
    description: "Run your own AI-powered fund",
  },
  { label: "pfund", href: "https://pfund.pfund.ai", description: "Trade engine" },
  { label: "pfeed", href: "https://pfeed.pfund.ai", description: "Data engine" },
  {
    label: "pytrade.org",
    href: "https://pytrade.org",
    description: "Learn trading with Python, from first steps to real strategies",
  },
];
