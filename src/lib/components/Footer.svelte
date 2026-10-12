<script lang="ts">
  import type { Component } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";
  import Discord from "~icons/simple-icons/discord";
  import Github from "~icons/simple-icons/github";
  import Linkedin from "~icons/simple-icons/linkedin";
  import ArrowUpRight from "~icons/lucide/arrow-up-right";

  type FooterLink = {
    label: string;
    href: string; // "/..." = page on this site, "https://..." = opens in a new tab with an external-link arrow
    icon?: Component<SvelteHTMLElements["svg"]>;
  };
  type FooterSection = { title: string; links: FooterLink[] };

  // columns render left to right in this order
  const SECTIONS: FooterSection[] = [
    {
      title: "Website",
      links: [
        // TODO: remove Home once the pages below are live (it only fills the column for now)
        { label: "Home", href: "/" },
        // TODO: uncomment when the pages exist
        // { label: "Templates", href: "/templates" },
        // { label: "Skills", href: "/skills" },
        // { label: "Datasets", href: "/datasets" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "pfund", href: "https://pfund.pfund.ai" },
        { label: "pfeed", href: "https://pfeed.pfund.ai" },
        { label: "pytrade.org", href: "https://pytrade.org" },
      ],
    },
    // TODO: company section (about, contact, legal...) once those pages exist
    // {
    //   title: "Company",
    //   links: [],
    // },
    {
      title: "Social",
      links: [
        { label: "Discord", href: "https://discord.gg/vqpS94tpdp", icon: Discord },
        { label: "GitHub", href: "https://github.com/PFund-Software-Ltd", icon: Github },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/pfund-software-ltd/", icon: Linkedin },
      ],
    },
  ];

  const COMPANY_NAME = "PFund Software Ltd.";
</script>

<footer class="mt-24 border-t">
  <div class="max-w-380 mx-auto px-4 py-16">
    <!-- the columns as a block are centered; text inside each column stays left-aligned -->
    <nav class="flex flex-wrap justify-center gap-x-24 gap-y-12">
      {#each SECTIONS as section (section.title)}
        <div>
          <h2 class="font-mono text-sm font-semibold uppercase tracking-widest">{section.title}</h2>
          <ul class="mt-5 flex flex-col gap-3 text-muted-foreground">
            {#each section.links as link (link.href)}
              {@const external = link.href.startsWith("http")}
              <li>
                <a
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  class="group inline-flex items-center gap-2 rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {#if link.icon}
                    <link.icon class="size-4" aria-hidden="true" />
                  {/if}
                  {link.label}
                  <!-- social links already read as external from their icon -->
                  {#if external && !link.icon}
                    <ArrowUpRight
                      class="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </nav>

    <div class="mt-16 flex flex-col gap-1 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} {COMPANY_NAME} All rights reserved.</p>
      <p>Built in Toronto, Canada</p>
    </div>
  </div>
</footer>
