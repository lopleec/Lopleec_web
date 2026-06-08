import {
  SITE_ORIGIN,
  SITE_EMAIL,
} from './agent-ready';
import {
  DEFAULT_LOCALE,
  LOCALES,
  buildLocalizedPath,
  resolvePathname,
  type RouteKey,
} from './content/site';

type BrowserModelContextTool = {
  description: string;
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
  inputSchema: Record<string, unknown>;
  name: string;
};

type BrowserModelContextLegacy = {
  provideContext: (context: { tools: BrowserModelContextTool[] }) => void;
};

type BrowserModelContextModern = {
  registerTool: (tool: BrowserModelContextTool) => void;
};

declare global {
  interface Document {
    modelContext?: BrowserModelContextLegacy | BrowserModelContextModern;
  }

  interface Navigator {
    modelContext?: BrowserModelContextLegacy | BrowserModelContextModern;
  }
}

const ROUTE_KEYS: RouteKey[] = [
  'home',
  'about-me',
  'now',
  'fun',
  'projects',
  'skills',
  'award',
  'links',
];

const EXTERNAL_RESOURCES = {
  bilibili: 'https://space.bilibili.com/3493127828540221',
  github: 'https://github.com/lopleec',
  reddit: 'https://www.reddit.com/user/lopleec',
  x: 'https://x.com/Lopleec',
  youtube: 'https://www.youtube.com/@Lopleec',
} as const;

const navigateWithinSite = (nextPath: string) => {
  window.history.pushState(null, '', nextPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

let hasRegisteredWebMcpTools = false;

const buildWebMcpTools = (): BrowserModelContextTool[] => [
      {
        name: 'navigate-site-section',
        description:
          'Navigate to a specific section of the Lopleec website in English or Simplified Chinese.',
        inputSchema: {
          type: 'object',
          properties: {
            locale: {
              type: 'string',
              description: 'Target locale for the page.',
              enum: LOCALES,
            },
            route: {
              type: 'string',
              description: 'Site section to open.',
              enum: ROUTE_KEYS,
            },
          },
          required: ['route'],
        },
        execute: ({ locale: nextLocale, route }) => {
          const currentLocale = resolvePathname(
            window.location.pathname,
            DEFAULT_LOCALE,
          ).locale;
          const normalizedLocale =
            nextLocale === 'zh-cn' || nextLocale === 'en' ? nextLocale : currentLocale;
          const normalizedRoute = ROUTE_KEYS.includes(route as RouteKey)
            ? (route as RouteKey)
            : 'home';
          const nextPath = buildLocalizedPath(normalizedLocale, normalizedRoute);
          navigateWithinSite(nextPath);

          return {
            locale: normalizedLocale,
            ok: true,
            path: nextPath,
            route: normalizedRoute,
          };
        },
      },
      {
        name: 'copy-contact-email',
        description: 'Copy Lopleec contact email to the clipboard.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        execute: async () => {
          await navigator.clipboard.writeText(SITE_EMAIL);
          return {
            copied: true,
            email: SITE_EMAIL,
          };
        },
      },
      {
        name: 'open-external-resource',
        description:
          'Open one of Lopleec’s external profiles, such as GitHub, YouTube, X, Bilibili, or Reddit.',
        inputSchema: {
          type: 'object',
          properties: {
            destination: {
              type: 'string',
              description: 'Which external destination to open.',
              enum: Object.keys(EXTERNAL_RESOURCES),
            },
          },
          required: ['destination'],
        },
        execute: ({ destination }) => {
          const href =
            EXTERNAL_RESOURCES[destination as keyof typeof EXTERNAL_RESOURCES] ??
            EXTERNAL_RESOURCES.github;

          const nextWindow = window.open(href, '_blank', 'noopener,noreferrer');
          if (!nextWindow) {
            window.location.assign(href);
          }

          return {
            href,
            ok: true,
          };
        },
      },
      {
        name: 'get-site-context',
        description:
          'Return the current locale, route, and canonical URL for the page currently open on lopleec.com.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
        execute: () => {
          const resolved = resolvePathname(window.location.pathname, DEFAULT_LOCALE);
          const currentRoute = resolved.routeKey === 'not-found' ? 'home' : resolved.routeKey;
          return {
            canonicalUrl: `${SITE_ORIGIN}${resolved.canonicalPath}`,
            locale: resolved.locale,
            route: currentRoute,
          };
        },
      },
    ];

export const registerWebMcpTools = () => {
  if (typeof window === 'undefined' || hasRegisteredWebMcpTools) {
    return;
  }

  const modelContext = document.modelContext ?? navigator.modelContext;
  if (!modelContext) {
    return;
  }

  const tools = buildWebMcpTools();

  if ('provideContext' in modelContext && typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools });
    hasRegisteredWebMcpTools = true;
    return;
  }

  if ('registerTool' in modelContext && typeof modelContext.registerTool === 'function') {
    tools.forEach((tool) => {
      modelContext.registerTool(tool);
    });
    hasRegisteredWebMcpTools = true;
  }
};
