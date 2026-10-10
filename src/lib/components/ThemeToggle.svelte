<script lang="ts">
  import { page } from "$app/state";
  import { THEME_COOKIE, type Theme } from "#lib/theme.ts";
  import Monitor from "~icons/lucide/monitor";
  import Sun from "~icons/lucide/sun";
  import Moon from "~icons/lucide/moon";

  // order = cycle order
  const options = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ] as const;

  // server reads the cookie (hooks.server.ts) → +layout.server.ts → page.data
  let theme = $state<Theme>(page.data.theme ?? "system");

  const index = $derived(options.findIndex((o) => o.value === theme));
  const current = $derived(options[index]);
  const next = $derived(options[(index + 1) % options.length]);

  function setTheme(value: Theme) {
    theme = value;
    document.documentElement.style.colorScheme = value === "system" ? "" : value;
    // system = no cookie
    const maxAge = value === "system" ? 0 : 60 * 60 * 24 * 365;
    document.cookie = `${THEME_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
  }
</script>

<button
  type="button"
  class="grid size-9 place-items-center rounded-md hover:bg-muted"
  aria-label="Theme: {current.label}. Switch to {next.label}"
  onclick={() => setTheme(next.value)}
>
  <current.icon class="size-[1em]" />
</button>
