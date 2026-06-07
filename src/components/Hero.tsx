import { useState, useEffect } from 'react';
import { ChevronDown } from './AkarIcons';
import type { SiteCopy } from '../content/site';
import type { MotionTier } from '../App';

const Typewriter = ({
  motionTier,
  texts,
}: {
  motionTier: MotionTier;
  texts: string[];
}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const currentFullText = texts[index] ?? '';
  const displayText = motionTier === 'lite' ? texts[0] ?? '' : text;

  useEffect(() => {
    if (motionTier === 'lite' || !currentFullText) return undefined;

    const typingDelay = motionTier === 'reduced' ? 90 : 120;
    const deletingDelay = motionTier === 'reduced' ? 30 : 40;
    const holdDelay = motionTier === 'reduced' ? 1500 : 2500;
    const shouldHold = !isDeleting && text === currentFullText;

    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (text === currentFullText) {
          setIsDeleting(true);
          return;
        }

        setText(currentFullText.substring(0, text.length + 1));
      } else {
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
          return;
        }

        setText(currentFullText.substring(0, text.length - 1));
      }
    }, shouldHold ? holdDelay : isDeleting ? deletingDelay : typingDelay);

    return () => window.clearTimeout(timeout);
  }, [currentFullText, index, isDeleting, motionTier, text, texts]);

  return (
    <span className="typewriter-text">
      {displayText}
      {motionTier === 'lite' ? null : <span className="cursor">|</span>}
    </span>
  );
};

export default function Hero({
  copy,
  motionTier,
}: {
  copy: SiteCopy['hero'];
  motionTier: MotionTier;
}) {
  const scrollToGrid = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: motionTier === 'full' ? 'smooth' : 'auto',
    });
  };

  return (
    <section className="hero">
      {/* Grunge texture - only covers hero */}
      <div className="texture-overlay" />
      <div className="blueprint-box">
        <div className="blueprint-cell cell-tl">
          <h1 className="hero-title">{copy.greeting}</h1>
        </div>
        <div className="blueprint-cell cell-tr">
          <div className="hero-avatar-wrapper">
            <img
              src="/头像.jpg"
              alt={copy.avatarAlt}
              className="hero-avatar"
              decoding="async"
              fetchPriority="high"
              loading="eager"
              width="164"
              height="164"
            />
          </div>
        </div>
        <div className="blueprint-cell cell-bl">
          <p className="hero-subtitle">
            {copy.subtitleLines[0]}
            <br />
            {copy.subtitleLines[1]}
          </p>
        </div>
        <div className="blueprint-cell cell-br">
          <h2 className="hero-title-main">
            <Typewriter motionTier={motionTier} texts={copy.names} />
          </h2>
        </div>
      </div>

      <div className="scroll-arrow" onClick={scrollToGrid}>
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
