# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 application for "マイクラRTAナビ" (Minecraft RTA Navigator), a Japanese website that provides guides, rules, and tools for Minecraft speedrunning. The app uses Vuetify for UI components, Fuse.js for search functionality, Discord OAuth for authentication, and includes a comprehensive markdown editor system.

## Development Commands

```bash
# Install dependencies (project uses pnpm)
pnpm install

# Start development server on http://localhost:3000
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

## Architecture

### Core Technologies
- **Nuxt 3** (SSR disabled) - Vue.js framework
- **Vuetify 3** - Material Design UI components  
- **Fuse.js** - Fuzzy search with configurable options
- **Discord.js** - Discord bot integration
- **nuxt-auth-utils** - Authentication management
- **TipTap** - Rich text editor with extensions
- **Sharp** - Server-side image processing
- **Sass** - CSS preprocessing

### Key Directories
- `app/` - Main application code (Nuxt convention)
  - `pages/` - File-based routing with dynamic slug pages
  - `components/` - Vue components including search, markdown, auth dialogs, editor components
  - `composables/` - Composable functions for search, auth, markdown processing, editor functionality
  - `middleware/` - Route middleware for authentication
  - `assets/data/` - Static data like page configuration and editor templates
  - `plugins/` - Vuetify configuration
  - `types/` - TypeScript type definitions
- `server/api/` - Nuxt server routes (Discord OAuth, content management APIs)

### Authentication System
- Discord OAuth integration via `nuxt-auth-utils`
- Global middleware checks authentication for `/moderation` and `/editor` routes
- Auth dialog composable manages login state
- Role-based permissions using Discord guild roles (admin, guide_editor, rules_editor)

### Search Implementation
- Fuse.js powers fuzzy search with weighted field scoring
- Search indexes built dynamically from markdown content
- Supports advanced query syntax (exact match, exclusion, OR/AND)
- Categories: guide, rules with Japanese display names

### Content Management
- Markdown files processed server-side with frontmatter metadata
- Dynamic routing for guide and rules sections via `[...slug].vue`
- TipTap editor for rich text editing capabilities

## Editor Functionality

### Markdown Editor System
- **TipTap WYSIWYG Editor**: Rich text editing with markdown export/import
- **GitHub Integration**: Direct read/write to `bafv4/mcsrnav-content` repository
- **Permission System**: Role-based access control by category
- **Auto-save**: LocalStorage draft system with 24-hour retention
- **Template System**: Pre-built templates for guides, rules, and general content
- **Image Management**: Upload with automatic optimization and WebP conversion
- **YouTube Integration**: Easy embedding of YouTube videos
- **Discord Notifications**: Webhook notifications for content changes

### Key Components
- `app/components/editor/tiptap-editor.vue` - Main WYSIWYG editor with toolbar
- `app/components/editor/metadata-editor.vue` - Frontmatter metadata management
- `app/components/editor/template-selector.vue` - Template selection dialog
- `app/pages/editor/[...path].vue` - Editor page with auto-save and recovery
- `app/pages/editor/index.vue` - File management interface with search/filter

### API Endpoints
- `GET /api/content/files` - List markdown files with metadata and permissions
- `GET /api/content/files/[...path]` - Get single file content with edit permissions
- `PUT /api/content/files/[...path]` - Save/update file content with GitHub commit
- `POST /api/content/images` - Upload images with optimization and GitHub storage
- `GET /api/content/templates` - Get available templates filtered by permissions

### Permission System
```typescript
// Permission levels per category
admin: all files (guide, rules, general)
guide_editor: guide category files only  
rules_editor: rules category files only
```

### Image Management
- **Upload Processing**: Sharp.js for resize/compression (max 1200px, 80% quality)  
- **WebP Generation**: Automatic WebP conversion for modern browsers
- **GitHub Storage**: Images stored in `images/{category}/{year}/{month}/` structure
- **UUID Naming**: Collision-free filename generation
- **Security**: File type and size validation (2MB limit)

### Template System
- **Built-in Templates**: Guide templates (basic, advanced, video, walkthrough), rule templates (competition, general), blank template
- **Category Filtering**: Templates filtered by user permissions
- **Metadata Integration**: Templates include pre-configured metadata
- **Statistics**: Word count, line count, estimated reading time

### Draft System
- **Auto-save**: Saves to localStorage every 5 seconds of inactivity
- **Recovery**: Prompts user to recover drafts on page load
- **Expiration**: 24-hour retention period
- **Versioning**: Basic version tracking for conflict resolution

### Environment Variables
```bash
# GitHub API integration (repo scope required)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Discord webhook for content change notifications (optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx

# Existing Discord OAuth variables
DISCORD_BOT_TOKEN=
TARGET_GUILD_ID=
ALLOWED_ROLE_IDS=
REDIRECT_URI=
DISCORD_REDIRECT_URI=
```

## Development Notes

- The app is SPA-only (`ssr: false`) 
- Uses file-based routing with catch-all dynamic routes
- Search functionality requires building indexes for each category
- Authentication is handled via Discord OAuth with role checking
- Component naming follows kebab-case convention (router-btn, auth-dialog)
- Uses TypeScript throughout with custom type definitions
- Editor functionality integrates with existing composables (useUserSession, useMarkdown)
- All editor operations require authentication and appropriate permissions
- GitHub API operations include proper error handling and rate limit considerations
- このプロジェクトの内容を把握してください。