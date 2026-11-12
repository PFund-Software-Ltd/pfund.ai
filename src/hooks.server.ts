import type { Handle } from "@sveltejs/kit/hooks";
import { THEME_COOKIE, parseTheme } from "#lib/theme.ts";
// TEMP: auth disabled until Better Auth is set up properly
// import { building } from "$app/env";
// import { auth } from "#lib/server/auth.ts";
// import { svelteKitHandler } from "better-auth/svelte-kit";

// const handleBetterAuth: Handle = async ({ event, resolve }) => {
//   const session = await auth.api.getSession({ headers: event.request.headers });

//   if (session) {
//     event.locals.session = session.session;
//     event.locals.user = session.user;
//   }

//   return svelteKitHandler({ event, resolve, auth, building });
// };

// export const handle: Handle = handleBetterAuth;
// put the saved theme into <html> before it's sent, so there's no flash
export const handle: Handle = ({ event, resolve }) => {
  const theme = parseTheme(event.cookies.get(THEME_COOKIE));
  event.locals.theme = theme;

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace("%theme%", theme),
  });
};
