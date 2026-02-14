# CollabCanvas Landing

This directory contains the CollabCanvas landing site built with Vite, React and TypeScript.

Note: this project is NOT connected to Lovable — all development and deployment are done locally or with your chosen hosting provider.

## Quick start (local development)

Requirements:
- Node.js 18+ (or as specified in the workspace)
- pnpm (recommended) or npm

Steps:

```powershell
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Change into the landing app
cd apps/collabcanvas-landing

# 3. Install dependencies (pnpm recommended)
pnpm install

# 4. Start the dev server
pnpm dev
```

The dev server runs with Vite's fast reload for local development.

## Build

```powershell
pnpm build
```

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

You can deploy this app with any static hosting platform that supports Vite builds (Vercel, Netlify, Cloudflare Pages, etc.). Build the site with `pnpm build` and follow your provider's instructions to publish the generated `dist` (or `build`) folder.

## Contributing

- Edit source files in `src/` and create pull requests against `main`.
- Run `pnpm dev` locally to verify changes.

If you want, I can add a short CONTRIBUTING snippet or deployment examples for a specific host — tell me which provider to target.
