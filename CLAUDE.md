# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MCRTAWIKI（マイクラRTAWiki）** - A Nuxt.js-based web application for Minecraft RTA (Real Time Attack) documentation with Discord-based authentication and role-based access control.

## Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Install dependencies
pnpm install
```

## Architecture

### Framework Stack
- **Nuxt 4.1.1** - Vue.js framework with SSR disabled (`ssr: false`)
- **Vue 3.5.21** - Frontend framework
- **Vuetify 3.9.7** - Material Design component framework
- **TypeScript** - Type safety with path aliases `@/*` → `./app/*` and `#/*` → `./shared/*`
- **PNPM** - Package manager

### Authentication System
- **Discord OAuth2** integration using `nuxt-auth-utils`
- Role-based access control with three permission levels:
  - Admin Role (`ADMIN_ROLE_ID`)
  - Rules Editor Role (`RULES_EDITOR_ROLE_ID`) 
  - Guide Editor Role (`GUIDE_EDITOR_ROLE_ID`)
- Server-side validation in `server/utils/authority-server.ts`
- Authentication handler at `server/api/auth/discord.get.ts`

### Directory Structure
```
app/                    # Client-side application code
├── assets/            # Static assets and styles
├── components/        # Vue components
├── composables/       # Vue composables
├── layouts/           # Layout components
├── middleware/        # Route middleware
├── pages/             # File-based routing
├── plugins/           # Nuxt plugins (Vuetify setup)
└── utils/             # Client-side utilities

server/                # Server-side code
├── api/               # API routes
└── utils/             # Server-side utilities

shared/                # Shared code between client/server
├── types/             # TypeScript type definitions
└── utils/             # Shared utilities
```

### Styling & UI
- **Vuetify** configured with Material Design Icons (MDI) and FontAwesome
- **SCSS** styling with custom themes (light/dark mode support)
- Theme configuration in `app/plugins/vuetify.ts`
- Custom styles in `app/assets/styles/`

### Key Features
- **Search functionality** using Fuse.js for fuzzy searching
- **Markdown rendering** with `markdown-it`
- **Image optimization** with `@nuxt/image`
- **Font loading** with `@nuxt/fonts`

### Environment Configuration
Required environment variables:
- `DISCORD_BOT_TOKEN` - Discord bot token for API access
- `TARGET_GUILD_ID` - Discord server ID
- `REDIRECT_URI` - OAuth redirect URI
- `ADMIN_ROLE_ID`, `RULES_EDITOR_ROLE_ID`, `GUIDE_EDITOR_ROLE_ID` - Discord role IDs
- `GITHUB_TOKEN` - For GitHub integration
- `DISCORD_WEBHOOK_URL` - For Discord notifications

### Development Notes
- Uses file-based routing via Nuxt pages
- TypeScript paths: `@/` for app directory, `#/` for shared directory
- Authority validation happens server-side before setting user session
- Discord avatar URLs are dynamically constructed based on guild membership