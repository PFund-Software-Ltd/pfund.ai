<script lang="ts">
    import Logo from "./Logo.svelte";
    import ThemeToggle from "./ThemeToggle.svelte";
</script>

<!-- pinned to the top; translucent + blur so content scrolling underneath doesn't clash with it -->
<header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
  <nav class="max-w-380 mx-auto p-4 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 text-2xl">
      <span class="grid size-[1.25em] place-items-center rounded-[0.25em] bg-foreground text-background">
        <Logo class="h-[0.6em] w-auto" aria-hidden="true" />
      </span>
      <span class="font-['Newsreader'] font-bold [text-box:trim-both_cap_alphabetic]">PFund</span>
    </a>
    <!-- TODO: re-enable when ready; won't fit on mobile -> hidden md:flex + burger menu (md:hidden) -->
    <!-- <ul class="flex items-center gap-12 font-medium text-foreground/80 *:hover:text-foreground">
      <li><a href="/templates">Templates</a></li>
      <li><a href="/skills">Skills</a></li>
      <li><a href="/datasets">Datasets</a></li>
    </ul> -->
    <div class="flex items-center gap-2 font-medium text-foreground/80 *:hover:text-foreground">
      <!-- TODO: re-enable when ready -->
      <!-- <a href="/login" class="ml-auto">Log In</a> -->
      <ThemeToggle />
    </div>
  </nav>
</header>
