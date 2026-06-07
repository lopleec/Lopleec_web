import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Envelope,
  GithubFill,
  LinkChain,
} from './AkarIcons';
import type { RouteKey, SiteCopy } from '../content/site';

const COLOR_THEMES = [
  { color2: '#c8fa00', color1: '#1a1a2e' },
  { color2: '#06d6a0', color1: '#1a1a2e' },
  { color2: '#f72585', color1: '#1a1a2e' },
  { color2: '#4cc9f0', color1: '#1a1a2e' },
  { color2: '#ff6b6b', color1: '#c8fa00' },
];

type HomeRouteKey = Exclude<RouteKey, 'home'>;

export default function BentoGrid({
  copy,
  paths,
  onOpenInternalPage,
}: {
  copy: SiteCopy['cards'];
  paths: Record<RouteKey, string>;
  onOpenInternalPage?: (path: HomeRouteKey, sourceElement: HTMLElement) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [themeIndex] = useState(
    () => Math.floor(Math.random() * COLOR_THEMES.length),
  );
  const [copied, setCopied] = useState(false);
  const [gridUnit, setGridUnit] = useState('280px');

  const currentTheme = COLOR_THEMES[themeIndex];

  const copyEmail = () => {
    void navigator.clipboard.writeText('me@lopleec.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const updateGridUnit = () => {
      const styles = window.getComputedStyle(grid);
      const columns = styles.gridTemplateColumns.split(' ').filter(Boolean).length;

      if (columns <= 1) {
        setGridUnit('auto');
        return;
      }

      const gap = parseFloat(styles.columnGap || styles.gap || '0');
      const width = grid.clientWidth;
      const unit = (width - gap * (columns - 1)) / columns;

      setGridUnit(`${unit}px`);
    };

    updateGridUnit();

    const observer = new ResizeObserver(updateGridUnit);
    observer.observe(grid);

    window.addEventListener('resize', updateGridUnit);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateGridUnit);
    };
  }, []);

  return (
    <section className="bento-container">
      <div
        ref={gridRef}
        className="bento-grid"
        style={{ '--grid-unit': gridUnit } as CSSProperties}
      >
        <div className="bento-item item-large intro-card">
          <div className="intro-heading">
            <h2>{copy.introTitle}</h2>
            <p className="intro-desc">{copy.introDescription}</p>
          </div>

          <div
            className="intro-pattern"
            style={
              {
                '--color1': currentTheme.color1,
                '--color2': currentTheme.color2,
              } as CSSProperties
            }
          />

          <div className="intro-cta">
            <div className="intro-cta-buttons">
              <button
                className="intro-btn-email"
                onClick={copyEmail}
                type="button"
              >
                <Envelope size={16} />
                {copied ? copy.copied : copy.email}
              </button>
              <a
                className="intro-btn-talk"
                href={paths['about-me']}
                onClick={(event) => {
                  if (!onOpenInternalPage) return;
                  event.preventDefault();
                  onOpenInternalPage('about-me', event.currentTarget);
                }}
              >
                <ArrowUpRight size={16} />
                {copy.learnMore}
              </a>
            </div>
          </div>
        </div>

        <div
          className="bento-item glass item-small social-card social-card-github"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GithubFill size={96} color="#ffffff" />
          <a
            className="card-link-button card-link-button-github"
            href="https://github.com/lopleec"
            aria-label={copy.githubAria}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="bento-item item-small now-card">
          <div className="now-card-copy">
            <div className="now-card-title">
              <span className="now-card-title-shadow">{copy.nowBigWord}</span>
              <span className="now-card-title-main">{copy.nowBigWord}</span>
            </div>
            <p className="now-card-subtitle">{copy.nowSubtitle}</p>
          </div>

          <a
            className="card-link-button card-link-button-now"
            href={paths.now}
            aria-label={copy.nowSubtitle}
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('now', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="bento-item item-small fun-card">
          <div className="fun-card-blob">
            <div className="fun-card-eye" />
          </div>

          <a
            className="card-link-button card-link-button-fun"
            href={paths.fun}
            aria-label="Open fun page"
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('fun', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="bento-item item-wide projects-card">
          <h3 className="projects-card-title">{copy.projects}</h3>

          <a
            className="card-link-button card-link-button-projects"
            href={paths.projects}
            aria-label={copy.projects}
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('projects', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="bento-item item-small skills-card">
          <h3 className="skills-card-title">{copy.skills}</h3>

          <a
            className="card-link-button card-link-button-skills"
            href={paths.skills}
            aria-label={copy.skills}
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('skills', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="bento-item item-small say-hi-card">
          <div className="say-hi-card-copy">
            <h3 className="say-hi-card-title">{copy.sayHi}</h3>
            <p className="say-hi-card-desc">{copy.sayHiDescription}</p>
          </div>

          <a
            className="say-hi-card-email"
            href="mailto:me@lopleec.com"
            aria-label="Email Lopleec"
          >
            <Envelope size={20} />
            me@lopleec.com
          </a>
        </div>

        <div className="bento-item item-small award-card">
          <h3 className="award-card-title">{copy.award}</h3>

          <a
            className="card-link-button card-link-button-award"
            href={paths.award}
            aria-label={copy.award}
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('award', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>

        <div
          className="bento-item glass item-small social-card social-card-links"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinkChain size={88} color="#ffffff" />
          <a
            className="card-link-button card-link-button-links"
            href={paths.links}
            aria-label={copy.linksAria}
            onClick={(event) => {
              if (!onOpenInternalPage) return;
              event.preventDefault();
              onOpenInternalPage('links', event.currentTarget);
            }}
          >
            <ArrowUpRight size={22} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
