import { ArrowLeft } from './AkarIcons';
import type { SiteCopy } from '../content/site';

export default function NowPage({
  copy,
  homeAriaLabel,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['nowPage'];
  homeAriaLabel: string;
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  return (
    <main className="learn-more-page now-page">
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

      <section className="now-page-stage">
        <h1 className="now-page-title">{copy.title}</h1>

        <div className="now-page-rail" aria-label={copy.title}>
          <div className="now-page-marquee">
            <div className="now-page-marquee-track">
              {[0, 1].map((groupIndex) => (
                <div
                  className="now-page-marquee-group"
                  key={groupIndex}
                  aria-hidden={groupIndex === 1}
                >
                  {copy.items.map((item, index) => (
                    <span className="now-page-marquee-item" key={`${groupIndex}-${item}-${index}`}>
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
