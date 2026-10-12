// Syntax highlighting runs on the server only: the browser gets finished HTML, never the shiki bundle.
// Queries run during SSR are embedded in the page, so hydration doesn't refetch them.
import { error } from "@sveltejs/kit";
import { query } from "$app/server";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// fine-grained imports: only the grammars/themes we use, not shiki's full bundle
const highlighter = createHighlighterCore({
  langs: [import("shiki/langs/python.mjs")],
  themes: [import("shiki/themes/one-light.mjs"), import("shiki/themes/one-dark-pro.mjs")],
  engine: createJavaScriptRegexEngine(),
});

const MAX_LENGTH = 5_000; // this is a public endpoint, so cap how much work one call can ask for

// 'unchecked': the input is a plain string, checked by hand below instead of a schema library
export const highlight = query("unchecked", async (code: string) => {
  if (typeof code !== "string" || code.length > MAX_LENGTH) error(400, "Invalid code");

  return (await highlighter).codeToHtml(code, {
    lang: "python",
    themes: { light: "one-light", dark: "one-dark-pro" },
    // emit `color: light-dark(...)`, so it follows the page's color-scheme like the rest of the site
    defaultColor: "light-dark()",
  });
});
