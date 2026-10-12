<script lang="ts" module>
  export type NavDropdownItem = {
    label: string;
    href: string; // "/..." = page on this site, "https://..." = opens in a new tab with an external-link arrow
    description?: string; // optional second line under the label
  };
</script>

<script lang="ts">
  // Navbar dropdown: a "disclosure" (button toggles a list of links), not an ARIA menu,
  // so Tab moves through the links as usual
  import ChevronDown from "~icons/lucide/chevron-down";
  import ArrowUpRight from "~icons/lucide/arrow-up-right";

  let { label, items }: { label: string; items: NavDropdownItem[] } = $props();

  const id = $props.id(); // unique per instance, links the button to its panel (aria-controls)

  let open = $state(false);
  let root: HTMLElement;
  let button: HTMLButtonElement;

  // close on a click anywhere outside the dropdown
  function onWindowClick(e: MouseEvent) {
    if (open && !root.contains(e.target as Node)) open = false;
  }

  // mouse: hover opens/closes. Touch and keyboard have no hover, so they still use click (see onButtonClick)
  function onPointerEnter(e: PointerEvent) {
    if (e.pointerType === "mouse") open = true;
  }
  function onPointerLeave(e: PointerEvent) {
    if (e.pointerType === "mouse") open = false;
  }
  function onButtonClick(e: MouseEvent) {
    // a mouse click would just undo what hovering already did
    if ((e as PointerEvent).pointerType === "mouse") return;
    open = !open;
  }

  // close on Escape, and hand focus back to the button
  function onWindowKeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") {
      open = false;
      button.focus();
    }
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<!-- hover is a mouse-only shortcut; keyboard and touch users open it with the button, so no role is needed here -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative" bind:this={root} onpointerenter={onPointerEnter} onpointerleave={onPointerLeave}>
  <button
    type="button"
    bind:this={button}
    aria-expanded={open}
    aria-controls={id}
    onclick={onButtonClick}
    class="flex items-center gap-1 rounded-md px-3 py-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
  >
    {label}
    <ChevronDown class="size-4 transition-transform {open ? 'rotate-180' : ''}" aria-hidden="true" />
  </button>
  {#if open}
    <!--
      centered under the button. pt-2 (not mt-2) on the wrapper: the gap above the panel stays part of the
      hover area, so moving the mouse from the button down to the panel doesn't close it
    -->
    <div class="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2">
      <ul {id} class="rounded-xl border bg-background p-2 shadow-lg">
        {#each items as item (item.href)}
          {@const external = item.href.startsWith("http")}
          <li>
            <a
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              onclick={() => (open = false)}
              class="group flex flex-col rounded-lg px-3 py-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span class="flex items-center gap-1 text-foreground">
                {item.label}
                {#if external}
                  <ArrowUpRight
                    class="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                {/if}
              </span>
              {#if item.description}
                <span class="text-sm font-normal text-muted-foreground">{item.description}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
