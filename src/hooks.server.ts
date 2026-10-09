import type { Handle } from "@sveltejs/kit/hooks";
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
export const handle: Handle = ({ event, resolve }) => resolve(event);
