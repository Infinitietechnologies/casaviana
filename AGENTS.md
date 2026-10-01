# Casa Viana AI Guidelines & Context

This project uses Antigravity Agent skills and rules for AI pair programming.

## Project Quick Reference
- **Framework**: Next.js 16 (Pages router) with React 19 and Tailwind CSS v4.
- **Detailed Skill Guide**: Read and refer to the full architectural skill guide at [`.agents/skills/casaviana-guide/SKILL.md`](./.agents/skills/casaviana-guide/SKILL.md).
- **Core Conventions**:
  - Keep `src/pages/` thin; place view rendering and UI state in `src/views/`.
  - Use `src/Api/api.js` for all backend communication; authentication headers are handled by `src/Api/interceptor.js`.
  - Guard browser storage access with `typeof window !== "undefined"`.
  - Support translations in `i18n.js` (`pt`, `en`, `fr`).
  - Next.js build is configured for static export (`output: 'export'`).
