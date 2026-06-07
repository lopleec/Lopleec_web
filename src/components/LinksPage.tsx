import { ArrowLeft, ArrowUpRight } from './AkarIcons';
import type { SiteCopy } from '../content/site';

export default function LinksPage({
  copy,
  homeAriaLabel,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['linksPage'];
  homeAriaLabel: string;
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  return (
    <main className="learn-more-page internal-page links-page">
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

      <section className="about-page-layout links-page-layout">
        <div className="about-page-sidebar links-page-sidebar">
          <h1 className="about-page-title links-page-title">{copy.title}</h1>
        </div>

        <article className="links-page-body">
          {copy.sections.map((section) => (
            <section className="links-page-section" key={section.title}>
              <div className="links-page-section-header">
                <h2 className="links-page-section-title">{section.title}</h2>
                <div className="article-placeholder-line links-page-line" aria-hidden="true" />
              </div>

              <div className="links-page-items">
                {section.items.map((item) =>
                  item.href ? (
                    <a
                      className="links-page-item links-page-item-link"
                      href={item.href}
                      key={`${section.title}-${item.text}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="links-page-item-copy">
                        {item.label ? (
                          <span className="links-page-item-label">{item.label}:</span>
                        ) : null}
                        <span className="links-page-item-text">{item.text}</span>
                      </span>
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </a>
                  ) : (
                    <p className="links-page-item links-page-item-note" key={`${section.title}-${item.text}`}>
                      {item.text}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
