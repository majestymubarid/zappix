# Progress Flow: Zappix Development

## Completed Tasks So Far (Phase 1 initialization)

1. **Environment Setup**
   - Updated PowerShell Execution Policy to allow running scripts (specifically `npm`).
   - Installed Git (via `winget`) to ensure npm could securely fetch packages from GitHub (e.g., `@whiskeysockets/baileys`).

2. **Next.js Scaffolding**
   - Successfully ran `create-next-app` initializing a Next.js (TypeScript, Tailwind, App Router) project directly into the `Zappix` root directory.
   - Kept the product-spec markdown documents intact alongside the source code.

3. **`package.json` Configuration**
   - Fixed the `name` attribute to lowercase `"zappix"` (to respect strict npm naming rules).
   - Added database script shortcuts for Prisma (`db:generate`, `db:migrate`, `db:seed`, `db:studio`).

4. **Dependencies Installation**
   - **Production:** Successfully installed `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`, `@tanstack/react-query`, `@prisma/client`, `bullmq`, `ioredis`, `@whiskeysockets/baileys`, `zod`, `react-hook-form`, `@hookform/resolvers`, `resend`, `recharts`, `@dnd-kit/core`, `@dnd-kit/sortable`, `date-fns`, `sharp`, `next-auth@beta`, `@auth/prisma-adapter`, `@hapi/boom`, and `qrcode`.
   - **Development:** Successfully installed `prisma`, `@types/qrcode`, `tsx`, `eslint`, and `eslint-config-next`.

5. **UI Components Setup**
   - Successfully ran `shadcn init` adding Default Slate styling and CSS Variables.
   - Installed all the required components (`button`, `card`, `input`, `label`, `select`, `textarea`, `table`, `badge`, `dialog`, `sheet`, `tabs`, `dropdown-menu`, `avatar`, `progress`, `sonner` (instead of deprecated toast), `calendar`, `popover`, `separator`, `skeleton`).

6. **Git Version Control & Deployment Location Change**
   - Git repository initialized via `git init`.
   - Modified all references in `implementation.md` to target **Oracle Cloud VPS** for deployment operations instead of the originally planned Hetzner servers.

## Next Steps to Pick Up (Action Items)

- Setup `src/lib/prisma.ts`, `prisma/schema.prisma` and `.env` variables (Database connection string setup).
- Run the first Prisma push (`npm run db:migrate`) locally.
- Write up TRPC config (`src/server/trpc/context.ts`, etc.).
