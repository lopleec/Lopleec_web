import {
  DEFAULT_LOCALE,
  LOCALES,
  SITE_COPY,
  buildLocalizedPath,
  normalizePathname,
  resolvePathname,
  type RouteKey,
} from './content/site';

export const SITE_ORIGIN = 'https://www.lopleec.com';
export const SITE_EMAIL = 'me@lopleec.com';
export const API_CATALOG_PROFILE = 'https://www.rfc-editor.org/info/rfc9727';
export const AGENT_SKILLS_SCHEMA =
  'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
export const AGENT_DISCOVERY_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</auth.md>; rel="service-doc"',
  '</.well-known/mcp/server-card.json>; rel="service-meta"',
].join(', ');

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

export const SITEMAP_URLS = LOCALES.flatMap((locale) =>
  ROUTE_KEYS.map((routeKey) => `${SITE_ORIGIN}${buildLocalizedPath(locale, routeKey)}`),
);

export const MARKDOWN_CAPABLE_PATHS = new Set([
  '/',
  ...LOCALES.flatMap((locale) =>
    ROUTE_KEYS.map((routeKey) => buildLocalizedPath(locale, routeKey)),
  ),
]);

export const estimateMarkdownTokens = (value: string) =>
  Math.max(1, Math.ceil(value.trim().length / 4));

export const wantsMarkdown = (acceptHeader: string | null | undefined) =>
  Boolean(acceptHeader && acceptHeader.toLowerCase().includes('text/markdown'));

const makeFrontmatter = (fields: Record<string, string>) =>
  `---\n${Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')}\n---\n\n`;

const formatLinks = (
  links: Array<{ href?: string; label?: string; text: string }>,
) =>
  links
    .map((item) =>
      item.href
        ? `- ${item.label ? `${item.label}: ` : ''}[${item.text}](${item.href})`
        : `- ${item.text}`,
    )
    .join('\n');

export const renderMarkdownForPath = (pathname: string) => {
  const resolved = resolvePathname(normalizePathname(pathname), DEFAULT_LOCALE);
  if (!resolved.isKnownRoute && normalizePathname(pathname) !== '/') {
    return null;
  }

  const routeKey = resolved.routeKey === 'not-found' ? 'home' : resolved.routeKey;
  const locale = resolved.locale;
  const copy = SITE_COPY[locale];
  const canonical = `${SITE_ORIGIN}${buildLocalizedPath(locale, routeKey)}`;
  const localeLabel = locale === 'zh-cn' ? 'zh-CN' : 'en';

  let body = '';

  switch (routeKey) {
    case 'home':
      body = [
        `# ${copy.pageTitles.home}`,
        '',
        `## ${copy.cards.introTitle}`,
        copy.cards.introDescription,
        '',
        '## Main sections',
        `- About: ${copy.cards.learnMore}`,
        `- Now: ${copy.cards.nowSubtitle}`,
        `- Projects: ${copy.cards.projects}`,
        `- Skills: ${copy.cards.skills}`,
        `- Award: ${copy.cards.award}`,
        `- Links: ${copy.cards.linksAria}`,
        '',
        `Contact: ${SITE_EMAIL}`,
      ].join('\n');
      break;
    case 'about-me':
      body = [
        `# ${copy.about.title}`,
        '',
        `## ${copy.about.introTitle}`,
        ...copy.about.paragraphs,
        '',
        `## ${copy.about.interestingFactTitle}`,
        ...copy.about.facts.flatMap((fact) => [fact.question, fact.answer, '']),
        copy.about.factsNote,
      ].join('\n');
      break;
    case 'now':
      body = [
        `# ${copy.nowPage.title}`,
        '',
        ...copy.nowPage.items.map((item) => `- ${item}`),
      ].join('\n');
      break;
    case 'fun':
      body = [
        `# ${copy.pageTitles.fun}`,
        '',
        'This page plays an audiovisual sequence and then reveals an ASCII title effect.',
      ].join('\n');
      break;
    case 'projects':
      body = [
        `# ${copy.projectsPage.title}`,
        '',
        ...copy.projectsPage.items.flatMap((item) => [
          `## ${item.name}`,
          item.description,
          ...item.links.map((link) => `- ${link.label}: [${link.href}](${link.href})`),
          '',
        ]),
      ].join('\n');
      break;
    case 'skills':
      body = [
        `# ${copy.skillsPage.title}`,
        '',
        ...copy.skillsPage.groups.flatMap((group) => [
          `## ${group.title}`,
          ...group.items.map((item) => `- ${item.label}: ${item.percent}%`),
          '',
        ]),
      ].join('\n');
      break;
    case 'award':
      body = [
        `# ${copy.awardPage.title}`,
        '',
        ...copy.awardPage.items.flatMap((item) => [
          `## ${item.name}`,
          item.description,
          `- Rank: ${item.rank}`,
          `- Note: ${item.note}`,
          '',
        ]),
      ].join('\n');
      break;
    case 'links':
      body = [
        `# ${copy.linksPage.title}`,
        '',
        ...copy.linksPage.sections.flatMap((section) => [
          `## ${section.title}`,
          formatLinks(section.items),
          '',
        ]),
      ].join('\n');
      break;
  }

  return (
    makeFrontmatter({
      canonical,
      locale: localeLabel,
      route: routeKey,
      title: copy.pageTitles[routeKey],
    }) + body.trim()
  );
};
