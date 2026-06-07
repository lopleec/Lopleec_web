import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ArrowLeft } from './AkarIcons';
import type { SiteCopy } from '../content/site';

const modulo = (value: number, base: number) => ((value % base) + base) % base;

const SLOT_TILTS = [0, -72, -144, 144, 72] as const;

type OrbitStyle = CSSProperties & {
  '--panel-angle': string;
  '--slot-angle': string;
  '--slot-tilt': string;
};

export default function SkillsPage({
  copy,
  homeAriaLabel,
  homePath,
  onReturnHome,
}: {
  copy: SiteCopy['skillsPage'];
  homeAriaLabel: string;
  homePath: string;
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  const [rotationIndex, setRotationIndex] = useState(0);
  const groupCount = copy.groups.length;
  const activeIndex = modulo(rotationIndex, groupCount);

  const panels = useMemo(
    () =>
      copy.groups.map((group, index) => {
        const slotIndex = modulo(index - activeIndex, groupCount);

        return {
          group,
          isActive: slotIndex === 0,
          slotIndex,
        };
      }),
    [activeIndex, copy.groups, groupCount],
  );

  const rotationStep = 360 / groupCount;
  const wheelRotation = -rotationIndex * rotationStep;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setRotationIndex((current) => current - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setRotationIndex((current) => current + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [groupCount]);

  return (
    <main className="learn-more-page skills-wheel-page">
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

      <section className="skills-wheel-stage" aria-label={copy.title}>
        <div className="skills-wheel-rig" aria-hidden="true">
          <div
            className="skills-wheel-track"
            style={{ transform: `rotate(${wheelRotation}deg)` }}
          >
            {panels.map(({ group, isActive, slotIndex }, index) => {
              const HeadingTag = isActive ? 'h1' : 'h2';
              const orbitStyle: OrbitStyle = {
                '--panel-angle': `${rotationStep * index}deg`,
                '--slot-angle': `${rotationStep * slotIndex}deg`,
                '--slot-tilt': `${SLOT_TILTS[slotIndex]}deg`,
              };

              return (
                <div
                  className="skills-wheel-orbit"
                  key={group.title}
                  style={orbitStyle}
                >
                  <article
                    className={`skills-wheel-panel${isActive ? ' is-active' : ''}`}
                    data-slot={slotIndex}
                  >
                    <HeadingTag className="skills-wheel-panel-title">{group.title}</HeadingTag>

                    <div className="skills-wheel-panel-items">
                      {group.items.map((item) => (
                        <div className="skills-wheel-row" key={`${group.title}-${item.label}`}>
                          <div className="skills-wheel-bar" aria-hidden="true">
                            <span
                              className="skills-wheel-bar-fill"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                          <span className="skills-wheel-label">{item.label}</span>
                          <span className="skills-wheel-percent">{item.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <div className="skills-wheel-controls">
          <p className="skills-wheel-hint">{copy.hint}</p>
          <div className="skills-wheel-buttons">
            <button
              className="skills-wheel-control"
              type="button"
              aria-label={copy.previousAria}
              onClick={() => {
                setRotationIndex((current) => current - 1);
              }}
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
            <button
              className="skills-wheel-control skills-wheel-control-next"
              type="button"
              aria-label={copy.nextAria}
              onClick={() => {
                setRotationIndex((current) => current + 1);
              }}
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
