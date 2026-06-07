import { ArrowLeft } from './AkarIcons';
import type { Locale } from '../content/site';

export default function InternalPageShell({
  description,
  homeAriaLabel,
  homePath,
  kicker,
  locale,
  onReturnHome,
  title,
}: {
  description: string;
  homeAriaLabel: string;
  homePath: string;
  kicker: string;
  locale: Locale;
  onReturnHome?: (sourceElement: HTMLElement) => void;
  title: string;
}) {
  return (
    <main className="learn-more-page internal-page article-placeholder-page">
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

      <section className="about-page-layout article-placeholder-layout">
        <div className="about-page-sidebar article-placeholder-sidebar">
          <p className="about-page-kicker article-placeholder-kicker">{kicker}</p>
          <h1 className="about-page-title article-placeholder-title">{title}</h1>
        </div>

        <article className="article-placeholder-body">
          <p className="article-placeholder-description">{description}</p>
          <div className="article-placeholder-line" aria-hidden="true" />
          <p className="article-placeholder-note">
            {locale === 'en'
              ? 'More will be added here soon.'
              : '这里的内容会在之后继续补充。'}
          </p>
        </article>
      </section>
    </main>
  );
}
