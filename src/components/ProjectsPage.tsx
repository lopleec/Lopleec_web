import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Branch, GithubFill, LinkChain, Star } from './AkarIcons';
import type { Locale, ProjectCardCopy, SiteCopy } from '../content/site';

type GithubRepoStats = {
  forks: number;
  license: string;
  stars: number;
};

const GITHUB_STATS_CACHE_KEY = 'lopleec-project-stats-v1';
const GITHUB_STATS_MAX_AGE_MS = 1000 * 60 * 30;

const formatCompactNumber = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'zh-cn' ? 'zh-CN' : 'en', {
    maximumFractionDigits: 1,
    notation: value >= 1000 ? 'compact' : 'standard',
  }).format(value);

const normalizeLicense = (license: { key?: string; spdx_id?: string } | null | undefined) => {
  if (!license) return 'N/A';
  if (license.spdx_id && license.spdx_id !== 'NOASSERTION') return license.spdx_id;
  if (license.key) return license.key.toUpperCase();
  return 'N/A';
};

const readCachedStats = () => {
  try {
    const raw = window.sessionStorage.getItem(GITHUB_STATS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      timestamp: number;
      values: Record<string, GithubRepoStats>;
    };

    if (Date.now() - parsed.timestamp > GITHUB_STATS_MAX_AGE_MS) {
      return null;
    }

    return parsed.values;
  } catch {
    return null;
  }
};

const writeCachedStats = (values: Record<string, GithubRepoStats>) => {
  try {
    window.sessionStorage.setItem(
      GITHUB_STATS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        values,
      }),
    );
  } catch {
    // ignore storage failures
  }
};

export default function ProjectsPage({
  copy,
  homeAriaLabel,
  homePath,
  locale,
  onReturnHome,
}: {
  copy: SiteCopy['projectsPage'];
  homeAriaLabel: string;
  homePath: string;
  locale: Locale;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  const [statsByRepo, setStatsByRepo] = useState<Record<string, GithubRepoStats>>(() =>
    typeof window === 'undefined' ? {} : readCachedStats() ?? {},
  );

  useEffect(() => {
    const repos = Array.from(
      new Set(copy.items.map((item) => item.githubRepo).filter((repo): repo is string => Boolean(repo))),
    );

    if (repos.length === 0) return undefined;

    const missingRepos = repos.filter((repo) => !statsByRepo[repo]);

    if (missingRepos.length === 0) {
      return undefined;
    }

    let cancelled = false;

    const loadStats = async () => {
      const results = await Promise.allSettled(
        missingRepos.map(async (repo) => {
          const response = await fetch(`https://api.github.com/repos/${repo}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${repo}`);
          }

          const data = (await response.json()) as {
            forks_count?: number;
            license?: { key?: string; spdx_id?: string } | null;
            stargazers_count?: number;
          };

          return [
            repo,
            {
              forks: data.forks_count ?? 0,
              license: normalizeLicense(data.license),
              stars: data.stargazers_count ?? 0,
            },
          ] as const;
        }),
      );

      if (cancelled) return;

      const nextStats = { ...statsByRepo };

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [repo, values] = result.value;
          nextStats[repo] = values;
        }
      });

      setStatsByRepo(nextStats);
      writeCachedStats(nextStats);
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [copy.items, statsByRepo]);

  return (
    <main className="learn-more-page projects-page">
      <button
        className="page-home-button"
        type="button"
        aria-label={homeAriaLabel}
        onClick={(event) => {
          event.stopPropagation();
          if (onReturnHome) {
            onReturnHome(event.currentTarget);
            return;
          }
          window.location.href = homePath;
        }}
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </button>

      <section className="projects-page-stage">
        <h1 className="projects-page-title">{copy.title}</h1>

        <div className="projects-page-list">
          {copy.items.map((project) => (
            <ProjectCard
              key={project.name}
              locale={locale}
              project={project}
              stats={project.githubRepo ? statsByRepo[project.githubRepo] : undefined}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProjectCard({
  locale,
  project,
  stats,
}: {
  locale: Locale;
  project: ProjectCardCopy;
  stats?: GithubRepoStats;
}) {
  return (
    <article className="project-entry-card">
      <header className="project-entry-head">
        <h2 className="project-entry-name">{project.name}</h2>

        {project.githubRepo ? (
          <div className="project-entry-stats" aria-label="Repository stats">
            <span className="project-entry-stat">
              <Star size={15} strokeWidth={1.9} />
              <span>{stats ? formatCompactNumber(stats.stars, locale) : '...'}</span>
            </span>
            <span className="project-entry-stat project-entry-license">
              <span>{stats ? stats.license : '...'}</span>
            </span>
            <span className="project-entry-stat">
              <Branch size={15} strokeWidth={1.9} />
              <span>{stats ? formatCompactNumber(stats.forks, locale) : '...'}</span>
            </span>
          </div>
        ) : null}
      </header>

      <p className="project-entry-description">{project.description}</p>

      <div className="project-entry-links">
        {project.links.map((link) => (
          <a
            className="project-entry-link"
            href={link.href}
            key={`${project.name}-${link.href}`}
            target="_blank"
            rel="noreferrer"
          >
            {link.type === 'github' ? (
              <GithubFill size={15} />
            ) : link.type === 'website' ? (
              <LinkChain size={16} strokeWidth={2} />
            ) : (
              <ArrowUpRight size={16} strokeWidth={2} />
            )}
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </article>
  );
}
