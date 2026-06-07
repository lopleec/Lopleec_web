import { ArrowLeft } from './AkarIcons';
import type { SiteCopy } from '../content/site';

export default function AwardPage({
  copy,
  homeAriaLabel,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['awardPage'];
  homeAriaLabel: string;
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  return (
    <main className="learn-more-page projects-page award-page">
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

      <section className="projects-page-stage award-page-stage">
        <h1 className="projects-page-title award-page-title">{copy.title}</h1>

        <div className="projects-page-list award-page-list">
          {copy.items.map((item) => (
            <article className="project-entry-card award-entry-card" key={item.name}>
              <header className="project-entry-head award-entry-head">
                <h2 className="project-entry-name award-entry-name">{item.name}</h2>

                <div className="project-entry-stats award-entry-stats" aria-label="Award info">
                  <span className="project-entry-stat award-entry-rank">{item.rank}</span>
                  <span className="project-entry-stat project-entry-license award-entry-note">
                    {item.note}
                  </span>
                </div>
              </header>

              <p className="project-entry-description award-entry-description">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
