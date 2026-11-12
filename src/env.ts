import { defineEnvVars } from "@sveltejs/kit/env";

// TEMP: auth/db aren't used in production yet, so these vars aren't set on Vercel.
// Without a schema SvelteKit requires every var to be set (the build fails with env_invalid);
// this defaults a missing var to "" so the build passes and the types stay `string`.
// Remove `schema: orEmpty` (making them required again) once auth/db are set up in production.
const orEmpty = (value: string | undefined) => value ?? "";

export const variables = defineEnvVars({
  DATABASE_URL: { description: "The database connection string.", schema: orEmpty },
  ORIGIN: {
    description: "The app origin (base URL), e.g. `http://localhost:5173`.",
    schema: orEmpty,
  },
  BETTER_AUTH_SECRET: {
    description:
      "Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).",
    schema: orEmpty,
  },
  GITHUB_CLIENT_ID: {
    description:
      "GitHub OAuth client ID. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).",
    schema: orEmpty,
  },
  GITHUB_CLIENT_SECRET: {
    description:
      "GitHub OAuth client secret. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).",
    schema: orEmpty,
  },
});
