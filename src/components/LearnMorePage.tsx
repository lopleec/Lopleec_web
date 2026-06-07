import { ArrowLeft } from './AkarIcons';
import type { SiteCopy } from '../content/site';

export default function LearnMorePage({
  copy,
  homeAriaLabel,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['about'];
  homeAriaLabel: string;
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  return (
    <main className="learn-more-page internal-page about-page">
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

      <section className="about-page-layout">
        <div className="about-page-sidebar">
          <p className="about-page-kicker">{copy.kicker}</p>
          <h1 className="about-page-title">{copy.title}</h1>
        </div>

        <article className="about-page-body">
          <div className="about-page-section-header">
            <h2 className="about-page-section-title">{copy.introTitle}</h2>
          </div>

          {copy.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? 'about-page-lead' : undefined}
            >
              {paragraph}
            </p>
          ))}

          <blockquote className="about-page-quote">
            <p>{copy.quote}</p>
            <cite>{copy.quoteBy}</cite>
          </blockquote>

          <section className="about-page-facts" aria-labelledby="interesting-fact-title">
            <div className="about-page-facts-header">
              <h2 id="interesting-fact-title" className="about-page-section-title">
                {copy.interestingFactTitle}
              </h2>
            </div>

            <dl className="about-page-fact-list">
              {copy.facts.map((fact) => (
                <div className="about-page-fact-item" key={fact.question}>
                  <dt>{fact.question}</dt>
                  <dd>{fact.answer}</dd>
                </div>
              ))}
            </dl>

            <p className="about-page-facts-note">{copy.factsNote}</p>
          </section>
        </article>
      </section>
    </main>
  );
}
