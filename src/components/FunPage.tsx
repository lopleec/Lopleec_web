import { ArrowLeft } from './AkarIcons';
import { useEffect, useRef, useState } from 'react';
import type { SiteCopy } from '../content/site';

const ASCII_TITLE = String.raw` __            _             
|  |   ___ ___| |___ ___ ___ 
|  |__| . | . | | -_| -_|  _|
|_____|___|  _|_|___|___|___|
          |_|                `;

export default function FunPage({
  homePath,
  labels,
  onReturnHome,
}: {
  homePath: string;
  labels: SiteCopy['fun'];
  onReturnHome?: (sourceElement: HTMLElement) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [isAsciiDimmed, setIsAsciiDimmed] = useState(false);
  const [hasPlaybackTriggered, setHasPlaybackTriggered] = useState(false);

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.ended || hasVideoEnded) {
      video.currentTime = 0;
      setHasVideoEnded(false);
      setIsAsciiDimmed(false);
    }

    setHasPlaybackTriggered(true);
    void video.play().catch(() => {});
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setHasVideoEnded(true);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!hasVideoEnded) return undefined;

    let dimTimer = 0;
    let restoreTimer = 0;
    let isCancelled = false;

    const scheduleFlicker = () => {
      const nextDelay = 70 + Math.random() * 560;
      dimTimer = window.setTimeout(() => {
        if (isCancelled) return;

        setIsAsciiDimmed(true);

        const dimDuration = 18 + Math.random() * 86;
        restoreTimer = window.setTimeout(() => {
          if (isCancelled) return;
          setIsAsciiDimmed(false);

          if (Math.random() < 0.58) {
            dimTimer = window.setTimeout(() => {
              if (isCancelled) return;

              setIsAsciiDimmed(true);
              restoreTimer = window.setTimeout(() => {
                if (isCancelled) return;
                setIsAsciiDimmed(false);
                scheduleFlicker();
              }, 14 + Math.random() * 72);
            }, 18 + Math.random() * 120);
            return;
          }

          scheduleFlicker();
        }, dimDuration);
      }, nextDelay);
    };

    scheduleFlicker();

    return () => {
      isCancelled = true;
      window.clearTimeout(dimTimer);
      window.clearTimeout(restoreTimer);
    };
  }, [hasVideoEnded]);

  return (
    <main className="fun-page">
      <button
        className="page-home-button fun-page-home"
        type="button"
        aria-label={labels.homeAria}
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

      <video
        ref={videoRef}
        className="fun-page-video"
        playsInline
        preload="auto"
      >
        <source src="/videos/TNT.mp4" type="video/mp4" />
        <source src="/videos/TNT.mov" type="video/quicktime" />
      </video>

      <div
        className={`fun-page-ascii${hasVideoEnded ? ' is-visible' : ''}${isAsciiDimmed ? ' is-dimmed' : ''}`}
        aria-hidden="true"
      >
        <pre>{ASCII_TITLE}</pre>
      </div>

      {!hasPlaybackTriggered ? (
        <button
          className="fun-page-audio-gate"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            startPlayback();
          }}
        >
          DO NOT CLICK ME
        </button>
      ) : null}
    </main>
  );
}
