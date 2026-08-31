import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Branch, GithubFill, LinkChain, Star } from './AkarIcons';
import type { Locale, ProjectCardCopy, SiteCopy } from '../content/site';

type GithubRepoStats = {
  forks: number;
  license: string;
  stars: number;
};

const GITHUB_STATS_CACHE_KEY = 'lopleec-project-stats-v1';
const GITHUB_STATS_MAX_AGE_MS = 1000 * 60 * 30;
const GITHUB_STATS_TIMEOUT_MS = 8000;

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
  const [unavailableRepos, setUnavailableRepos] = useState<Set<string>>(() => new Set());
  const requestedReposRef = useRef(new Set<string>());

  useEffect(() => {
    const requestedRepos = requestedReposRef.current;
    const repos = Array.from(
      new Set(copy.items.map((item) => item.githubRepo).filter((repo): repo is string => Boolean(repo))),
    );

    if (repos.length === 0) return undefined;

    const missingRepos = repos.filter(
      (repo) =>
        !statsByRepo[repo] &&
        !unavailableRepos.has(repo) &&
        !requestedRepos.has(repo),
    );

    if (missingRepos.length === 0) {
      return undefined;
    }

    missingRepos.forEach((repo) => requestedRepos.add(repo));

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), GITHUB_STATS_TIMEOUT_MS);

    const loadStats = async () => {
      const results = await Promise.allSettled(
        missingRepos.map(async (repo) => {
          const response = await fetch(`https://api.github.com/repos/${repo}`, {
            signal: controller.signal,
          });
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

      setUnavailableRepos((currentRepos) => {
        const rejectedRepos = results.flatMap((result, index) =>
          result.status === 'rejected' ? [missingRepos[index]] : [],
        );

        if (rejectedRepos.length === 0) return currentRepos;

        const nextRepos = new Set(currentRepos);

        rejectedRepos.forEach((repo) => {
          nextRepos.add(repo);
        });

        return nextRepos;
      });

      setStatsByRepo((currentStats) => {
        const successfulResults = results.flatMap((result) =>
          result.status === 'fulfilled' ? [result.value] : [],
        );

        if (successfulResults.length === 0) return currentStats;

        const nextStats = { ...currentStats };

        successfulResults.forEach(([repo, values]) => {
          nextStats[repo] = values;
        });

        writeCachedStats(nextStats);
        return nextStats;
      });
    };

    void loadStats();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
      missingRepos.forEach((repo) => requestedRepos.delete(repo));
    };
  }, [copy.items, statsByRepo, unavailableRepos]);

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
              statsUnavailable={
                project.githubRepo ? unavailableRepos.has(project.githubRepo) : false
              }
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
  statsUnavailable,
}: {
  locale: Locale;
  project: ProjectCardCopy;
  stats?: GithubRepoStats;
  statsUnavailable: boolean;
}) {
  const statsPlaceholder = statsUnavailable ? 'N/A' : '...';

  return (
    <article className="project-entry-card">
      <header className="project-entry-head">
        <h2 className="project-entry-name">{project.name}</h2>

        {project.githubRepo ? (
          <div className="project-entry-stats" aria-label="Repository stats">
            <span className="project-entry-stat">
              <Star size={15} strokeWidth={1.9} />
              <span>{stats ? formatCompactNumber(stats.stars, locale) : statsPlaceholder}</span>
            </span>
            <span className="project-entry-stat project-entry-license">
              <span>{stats ? stats.license : statsPlaceholder}</span>
            </span>
            <span className="project-entry-stat">
              <Branch size={15} strokeWidth={1.9} />
              <span>{stats ? formatCompactNumber(stats.forks, locale) : statsPlaceholder}</span>
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
