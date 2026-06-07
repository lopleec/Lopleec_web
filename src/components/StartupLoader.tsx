import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '../content/site';
import type { MotionTier } from '../App';

export default function StartupLoader({
  exiting,
  locale,
  motionTier,
  progress,
}: {
  exiting: boolean;
  locale: Locale;
  motionTier: MotionTier;
  progress: number;
}) {
  const [viewport, setViewport] = useState(() => ({
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const maxRadius = useMemo(
    () => Math.hypot(viewport.width / 2, viewport.height / 2) + 96,
    [viewport.height, viewport.width],
  );
  const circleDiameter = 108 + ((maxRadius * 2 - 108) * progress) / 100;
  const circleScale = circleDiameter / 108;
  const displayProgress = Math.round(progress);
  const progressLabel = locale === 'zh-cn' ? 'Loding' : 'Loding';

  return (
    <div
      className={`startup-loader${exiting ? ' is-exiting' : ''}`}
      data-motion-tier={motionTier}
      aria-hidden="true"
    >
      <div
        className="startup-loader-circle"
        style={{
          transform: `translate(-50%, -50%) scale(${circleScale})`,
        }}
      />

      <div className="startup-loader-center">
        <p className="startup-loader-brand">Lopleec.com</p>
        <p className="startup-loader-progress">
          {progressLabel} <span className="startup-loader-progress-value">{displayProgress}%</span>
        </p>
      </div>
    </div>
  );
}
