import { Gear } from './AkarIcons';
import { useEffect, useRef, useState } from 'react';
import type { ContrastMode, Locale, SiteCopy } from '../content/site';

type SettingsMenuProps = {
  contrastMode: ContrastMode;
  copy: SiteCopy['settings'];
  languagePrompt: {
    onAccept: () => void;
    onDismiss: () => void;
    visible: boolean;
  };
  locale: Locale;
  onContrastChange: (nextContrast: ContrastMode) => void;
  onLocaleChange: (nextLocale: Locale) => void;
};

export default function SettingsMenu({
  contrastMode,
  copy,
  languagePrompt,
  locale,
  onContrastChange,
  onLocaleChange,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="settings-shell" ref={shellRef}>
      <button
        className="settings-trigger"
        type="button"
        aria-label={copy.settings}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <Gear size={20} strokeWidth={2} />
      </button>

      {!open && languagePrompt.visible ? (
        <section className="language-prompt-card" aria-label="Language preference suggestion">
          <div className="language-prompt-copy">
            <p className="language-prompt-label">Language</p>
            <h2 className="language-prompt-title">Would you like to use 简体中文?</h2>
            <p className="language-prompt-question">Your browser looks like it prefers Chinese.</p>
            <p className="language-prompt-description">
              You can switch this website to 简体中文 now, or keep using English.
            </p>
          </div>

          <div className="language-prompt-actions">
            <button
              className="language-prompt-dismiss"
              type="button"
              onClick={() => {
                languagePrompt.onDismiss();
              }}
            >
              No, don&apos;t change
            </button>
            <button
              className="language-prompt-accept"
              type="button"
              onClick={() => {
                languagePrompt.onAccept();
              }}
            >
              Switch to 简体中文
            </button>
          </div>
        </section>
      ) : null}

      {open ? (
        <section className="settings-panel" aria-label={copy.settings}>
          <div className="settings-block">
            <div className="settings-label-row">
              <p className="settings-label">{copy.language}</p>
            </div>
            <div className="settings-option-row" role="radiogroup" aria-label={copy.language}>
              <button
                className={`settings-chip${locale === 'en' ? ' is-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={locale === 'en'}
                onClick={() => {
                  onLocaleChange('en');
                }}
              >
                {copy.english}
              </button>
              <button
                className={`settings-chip${locale === 'zh-cn' ? ' is-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={locale === 'zh-cn'}
                onClick={() => {
                  onLocaleChange('zh-cn');
                }}
              >
                {copy.simplifiedChinese}
              </button>
            </div>
          </div>

          <div className="settings-block">
            <div className="settings-label-row">
              <p className="settings-label">{copy.contrast}</p>
            </div>
            <div className="settings-option-row" role="radiogroup" aria-label={copy.contrast}>
              <button
                className={`settings-chip${contrastMode === 'standard' ? ' is-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={contrastMode === 'standard'}
                onClick={() => {
                  onContrastChange('standard');
                }}
              >
                {copy.standard}
              </button>
              <button
                className={`settings-chip${contrastMode === 'high' ? ' is-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={contrastMode === 'high'}
                onClick={() => {
                  onContrastChange('high');
                }}
              >
                {copy.high}
              </button>
            </div>
            <p className="settings-hint">{copy.contrastHint}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
