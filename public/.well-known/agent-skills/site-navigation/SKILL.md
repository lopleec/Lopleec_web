---
name: site-navigation
description: Navigate the bilingual Lopleec personal website and choose the correct localized route.
---

# Site Navigation

Use this skill when you need to move around the Lopleec website and select the right page for the task.

## Locales

- `https://www.lopleec.com/en` for English
- `https://www.lopleec.com/zh-cn` for Simplified Chinese

## Main routes

- `/about-me` for the biography page
- `/now` for the current activity page
- `/fun` for the audiovisual page
- `/projects` for the project list
- `/skills` for the skill wheel page
- `/award` for awards and milestones
- `/links` for social links and friend sites

## Guidance

- Preserve the current locale unless the user explicitly asks to switch language.
- Prefer localized paths such as `/en/projects` or `/zh-cn/projects` instead of unprefixed routes.
- If a route is missing, fall back to the localized home page.
