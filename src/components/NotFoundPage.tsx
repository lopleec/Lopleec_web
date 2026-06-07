import { ArrowLeft } from './AkarIcons';
import { useEffect, useState } from 'react';
import type { SiteCopy } from '../content/site';

export default function NotFoundPage({
  copy,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['notFound'];
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFonts = async () => {
      if (!('fonts' in document)) {
        if (!cancelled) setFontsReady(true);
        return;
      }

      try {
        await Promise.all([
          document.fonts.load('800 1em Orbitron'),
          document.fonts.load('700 1em MuseoModerno'),
        ]);
      } finally {
        if (!cancelled) setFontsReady(true);
      }
    };

    void loadFonts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="not-found-page">
      <section className={`not-found-shell${fontsReady ? ' is-ready' : ''}`}>
        <div className="not-found-code" aria-hidden="true">
          <span className="not-found-spark spark-green spark-1" />
          <span className="not-found-spark spark-yellow spark-2" />
          <span className="not-found-spark spark-blue spark-3" />
          <span className="not-found-spark spark-red spark-4" />
          <span className="not-found-spark spark-green spark-5" />
          <span className="not-found-spark spark-blue spark-6" />
          <span className="not-found-spark spark-yellow spark-7" />
          <span className="not-found-spark spark-red spark-8" />
          <span className="not-found-spark spark-blue spark-9" />
          <span className="not-found-spark spark-green spark-10" />
          <span className="not-found-spark spark-yellow spark-11" />
          <span className="not-found-spark spark-red spark-12" />
          <div className="not-found-digits">
            <span className="not-found-digit is-yellow">4</span>
            <span className="not-found-digit is-red">0</span>
            <span className="not-found-digit is-blue">4</span>
          </div>
        </div>

        <div className="not-found-copy">
          <h1 className="not-found-heading">{copy.heading}</h1>
          <p className="not-found-description">{copy.description}</p>
        </div>

        <button
          className="not-found-home-button"
          type="button"
          aria-label={copy.homeAria}
          onClick={(event) => {
            event.stopPropagation();
            if (onReturnHome) {
              onReturnHome(event.currentTarget);
              return;
            }
            window.location.href = homePath;
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.2} />
        </button>
      </section>
    </main>
  );
}
