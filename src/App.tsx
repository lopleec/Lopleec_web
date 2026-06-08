import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import SettingsMenu from './components/SettingsMenu';
import StartupLoader from './components/StartupLoader';
import { registerWebMcpTools } from './webmcp';
import {
  DEFAULT_LOCALE,
  SITE_COPY,
  buildLocalizedPath,
  normalizePathname,
  resolvePathname,
  switchLocalePath,
  type ContrastMode,
  type Locale,
  type RouteKey,
  type SiteCopy,
} from './content/site';

const loadFooter = () => import('./components/Footer');
const loadLearnMorePage = () => import('./components/LearnMorePage');
const loadNowPage = () => import('./components/NowPage');
const loadFunPage = () => import('./components/FunPage');
const loadProjectsPage = () => import('./components/ProjectsPage');
const loadSkillsPage = () => import('./components/SkillsPage');
const loadAwardPage = () => import('./components/AwardPage');
const loadLinksPage = () => import('./components/LinksPage');
const loadNotFoundPage = () => import('./components/NotFoundPage');

const Footer = lazy(loadFooter);
const LearnMorePage = lazy(loadLearnMorePage);
const NowPage = lazy(loadNowPage);
const FunPage = lazy(loadFunPage);
const ProjectsPage = lazy(loadProjectsPage);
const SkillsPage = lazy(loadSkillsPage);
const AwardPage = lazy(loadAwardPage);
const LinksPage = lazy(loadLinksPage);
const NotFoundPage = lazy(loadNotFoundPage);

const TRANSITION_EXPAND_MS = 420;
const TRANSITION_CONTRACT_MS = 420;
const LOADER_EXIT_MS = 280;

type AdaptiveLoadingMode = 'aggressive' | 'preload' | 'lazy';
export type MotionTier = 'high' | 'full' | 'reduced' | 'lite';
type AdaptiveProfile = {
  loadingMode: AdaptiveLoadingMode;
  motionTier: MotionTier;
};

type ConnectionLike = {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
};

type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

const STORAGE_KEYS = {
  contrast: 'lopleec-contrast-mode',
  languagePromptDismissed: 'lopleec-language-prompt-dismissed-v3',
  locale: 'lopleec-locale',
} as const;

const prefersMobileExperience = () => {
  if (typeof window === 'undefined') return false;
  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  return coarsePointer || window.innerWidth <= 768;
};

const HOME_ROUTE_SELECTORS: Record<Exclude<RouteKey, 'home'>, string> = {
  'about-me': '.intro-btn-talk',
  fun: '.card-link-button-fun',
  now: '.card-link-button-now',
  projects: '.card-link-button-projects',
  skills: '.card-link-button-skills',
  award: '.card-link-button-award',
  links: '.card-link-button-links',
};

type TransitionState = {
  backgroundColor: string;
  borderRadius: string;
  height: number;
  visible: boolean;
  left: number;
  top: number;
  transitionEnabled: boolean;
  width: number;
};

const waitForFrames = (count = 1) =>
  new Promise<void>((resolve) => {
    const step = () => {
      if (count <= 0) {
        resolve();
        return;
      }
      count -= 1;
      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  });

const waitForMs = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const getShapeFromElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);

  return {
    backgroundColor: styles.backgroundColor || '#ffffff',
    borderRadius: styles.borderRadius || '999px',
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
};

const getFullscreenCircle = (shape: {
  height: number;
  left: number;
  top: number;
  width: number;
}) => {
  const centerX = shape.left + shape.width / 2;
  const centerY = shape.top + shape.height / 2;
  const distances = [
    Math.hypot(centerX, centerY),
    Math.hypot(window.innerWidth - centerX, centerY),
    Math.hypot(centerX, window.innerHeight - centerY),
    Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY),
  ];
  const radius = Math.max(...distances) + 24;
  const size = radius * 2;

  return {
    backgroundColor: '#ffffff',
    borderRadius: '999px',
    height: size,
    left: centerX - radius,
    top: centerY - radius,
    width: size,
  };
};

const readStoredLocale = (): Locale => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.locale);
    return value === 'zh-cn' || value === 'en' ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
};

const readLanguagePromptDismissed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.languagePromptDismissed) === 'true';
  } catch {
    return false;
  }
};

const browserPrefersChinese = () => {
  if (typeof navigator === 'undefined') return false;
  const languages = [
    navigator.language,
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
  ].filter(Boolean);

  return languages.some((language) => language.toLowerCase().startsWith('zh'));
};

const readStoredContrast = (): ContrastMode => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.contrast);
    return value === 'standard' || value === 'high'
      ? value
      : 'standard';
  } catch {
    return 'standard';
  }
};

const RouteLoadingFallback = () => (
  <main className="learn-more-page route-loading-page" aria-busy="true" aria-live="polite">
    <div className="page-home-button route-loading-home-button" aria-hidden="true" />
  </main>
);

const wrapLazyPage = (page: ReactNode) => (
  <Suspense fallback={<RouteLoadingFallback />}>{page}</Suspense>
);

const getConnection = (): ConnectionLike | undefined => {
  const nav = navigator as Navigator & {
    connection?: ConnectionLike;
    mozConnection?: ConnectionLike;
    webkitConnection?: ConnectionLike;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
};

const assessAdaptiveProfile = (): AdaptiveProfile => {
  if (typeof window === 'undefined') {
    return {
      loadingMode: 'aggressive',
      motionTier: 'high',
    };
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const connection = getConnection();
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = connection?.saveData === true;
  const networkLooksGood =
    (connection?.effectiveType === '4g' || typeof connection?.effectiveType !== 'string') &&
    (typeof connection?.downlink !== 'number' || connection.downlink >= 2.5) &&
    (typeof connection?.rtt !== 'number' || connection.rtt <= 220);
  const networkLooksExcellent =
    connection?.effectiveType === '4g' &&
    (typeof connection?.downlink !== 'number' || connection.downlink >= 5) &&
    (typeof connection?.rtt !== 'number' || connection.rtt <= 160);
  const verySlowNetwork =
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    (typeof connection?.downlink === 'number' && connection.downlink < 0.6) ||
    (typeof connection?.rtt === 'number' && connection.rtt > 540);
  const slowNetwork =
    connection?.effectiveType === '3g' ||
    (typeof connection?.downlink === 'number' && connection.downlink < 1.1) ||
    (typeof connection?.rtt === 'number' && connection.rtt > 340);
  const veryConstrainedDevice =
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 1) ||
    (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2);
  const constrainedDevice =
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) ||
    (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4);
  const modernDevice =
    (typeof nav.deviceMemory !== 'number' || nav.deviceMemory >= 4) &&
    (typeof nav.hardwareConcurrency !== 'number' || nav.hardwareConcurrency >= 4);
  const highEndDevice =
    (typeof nav.deviceMemory !== 'number' || nav.deviceMemory >= 6) &&
    (typeof nav.hardwareConcurrency !== 'number' || nav.hardwareConcurrency >= 6);

  if (
    !saveData &&
    !reducedMotion &&
    (
      (networkLooksExcellent && highEndDevice) ||
      (networkLooksGood && modernDevice && !constrainedDevice)
    )
  ) {
    return {
      loadingMode: 'aggressive',
      motionTier: 'high',
    };
  }

  if (
    saveData ||
    reducedMotion ||
    veryConstrainedDevice ||
    (verySlowNetwork && constrainedDevice)
  ) {
    return {
      loadingMode: 'lazy',
      motionTier: 'lite',
    };
  }

  if (
    verySlowNetwork ||
    (slowNetwork && constrainedDevice) ||
    (constrainedDevice && !networkLooksGood)
  ) {
    return {
      loadingMode: 'lazy',
      motionTier: 'reduced',
    };
  }

  return {
    loadingMode: 'preload',
    motionTier: 'full',
  };
};

const warmFont = async (descriptor: string) => {
  if (!('fonts' in document)) return;

  try {
    await document.fonts.load(descriptor);
  } catch {
    // ignore font loading issues
  }
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });

const settleTasks = async (tasks: Array<Promise<unknown>>) => {
  await Promise.allSettled(tasks);
};

const settleWithTimeout = async (tasks: Array<Promise<unknown>>, timeoutMs: number) => {
  await Promise.race([
    settleTasks(tasks),
    waitForMs(timeoutMs),
  ]);
};

const scheduleIdleTask = (callback: () => void) => {
  const idleWindow = window as Window & {
    cancelIdleCallback?: (id: number) => void;
    requestIdleCallback?: (
      cb: (deadline: IdleDeadlineLike) => void,
      options?: { timeout: number },
    ) => number;
  };

  if (typeof idleWindow.requestIdleCallback === 'function') {
    const id = idleWindow.requestIdleCallback(
      () => {
        callback();
      },
      { timeout: 900 },
    );

    return () => {
      if (typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(id);
      }
    };
  }

  const timeoutId = window.setTimeout(callback, 220);
  return () => {
    window.clearTimeout(timeoutId);
  };
};

const ensureResourceHint = ({
  as,
  href,
  rel,
  type,
}: {
  as?: string;
  href: string;
  rel: 'preload' | 'prefetch';
  type?: string;
}) => {
  const absoluteHref = new URL(href, window.location.origin).href;
  const existing = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link')).some(
    (link) => link.rel === rel && link.href === absoluteHref,
  );

  if (existing) return;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;

  if (as) {
    link.as = as;
  }

  if (type) {
    link.type = type;
  }

  if (rel === 'preload') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
};

function DeferredFooter({
  copy,
  mode,
  motionTier,
}: {
  copy: SiteCopy['footer'];
  mode: AdaptiveLoadingMode;
  motionTier: MotionTier;
}) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shouldLoad = mode !== 'lazy' || hasIntersected;

  useEffect(() => {
    if (shouldLoad || !sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '420px 0px' },
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [mode, shouldLoad]);

  return (
    <div className="footer-lazy-slot" ref={sentinelRef}>
      {shouldLoad ? (
        <Suspense fallback={<div className="footer-lazy-placeholder" aria-hidden="true" />}>
          <Footer copy={copy} motionTier={motionTier} />
        </Suspense>
      ) : (
        <div className="footer-lazy-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

function App() {
  const [{ loadingMode, motionTier }] = useState<AdaptiveProfile>(() => assessAdaptiveProfile());
  const [preferredLocale, setPreferredLocale] = useState<Locale>(
    () => readStoredLocale(),
  );
  const [contrastMode, setContrastMode] = useState<ContrastMode>(
    () => readStoredContrast(),
  );
  const [pathname, setPathname] = useState(() =>
    resolvePathname(window.location.pathname, readStoredLocale()).canonicalPath,
  );
  const [circle, setCircle] = useState<TransitionState>({
    backgroundColor: '#ffffff',
    borderRadius: '999px',
    height: 0,
    left: 0,
    top: 0,
    transitionEnabled: false,
    width: 0,
    visible: false,
  });

  const homeScrollRef = useRef(0);
  const transitionLockRef = useRef(false);
  const bootAnimationFrameRef = useRef<number | null>(null);
  const bootProgressRef = useRef(0);
  const bootTargetRef = useRef(0);
  const [languagePromptDismissed, setLanguagePromptDismissed] = useState(() =>
    readLanguagePromptDismissed(),
  );
  const [bootProgress, setBootProgress] = useState(0);
  const [showBootLoader, setShowBootLoader] = useState(true);
  const [hideBootLoader, setHideBootLoader] = useState(false);
  const [isMobileExperience, setIsMobileExperience] = useState(() =>
    prefersMobileExperience(),
  );
  const [mobileNoticeDismissed, setMobileNoticeDismissed] = useState(false);
  const [mobileNoticeCopied, setMobileNoticeCopied] = useState(false);

  const resolvedPath = useMemo(
    () => resolvePathname(pathname, preferredLocale),
    [pathname, preferredLocale],
  );
  const locale = resolvedPath.locale;
  const routeKey = resolvedPath.routeKey;
  const copy = SITE_COPY[locale];
  const effectiveContrast = contrastMode;
  const shouldSkipRouteAnimation = motionTier === 'lite';
  const transitionExpandMs = motionTier === 'reduced' ? 240 : TRANSITION_EXPAND_MS;
  const transitionContractMs = motionTier === 'reduced' ? 240 : TRANSITION_CONTRACT_MS;
  const showLanguagePrompt =
    locale === 'en' && !languagePromptDismissed && browserPrefersChinese();

  const paths = useMemo(
    () => ({
      home: buildLocalizedPath(locale, 'home'),
      'about-me': buildLocalizedPath(locale, 'about-me'),
      now: buildLocalizedPath(locale, 'now'),
      fun: buildLocalizedPath(locale, 'fun'),
      projects: buildLocalizedPath(locale, 'projects'),
      skills: buildLocalizedPath(locale, 'skills'),
      award: buildLocalizedPath(locale, 'award'),
      links: buildLocalizedPath(locale, 'links'),
    }),
    [locale],
  );

  useEffect(() => {
    const canonicalPath = resolvePathname(
      window.location.pathname,
      preferredLocale,
    ).canonicalPath;

    if (normalizePathname(window.location.pathname) !== canonicalPath) {
      window.history.replaceState(null, '', canonicalPath);
    }
  }, [preferredLocale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.locale, locale);
    } catch {
      // ignore persistence failures
    }
  }, [locale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.contrast, contrastMode);
    } catch {
      // ignore persistence failures
    }
  }, [contrastMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === 'zh-cn' ? 'zh-CN' : 'en';
  }, [locale]);

  useEffect(() => {
    const updateMobileExperience = () => {
      setIsMobileExperience(prefersMobileExperience());
    };

    updateMobileExperience();
    window.addEventListener('resize', updateMobileExperience);

    return () => {
      window.removeEventListener('resize', updateMobileExperience);
    };
  }, []);

  useEffect(() => {
    document.title =
      routeKey === 'not-found'
        ? locale === 'zh-cn'
          ? '页面未找到 | Lopleec'
          : '404 | Lopleec'
        : copy.pageTitles[routeKey];
  }, [copy.pageTitles, locale, routeKey]);

  useEffect(() => {
    registerWebMcpTools();
  }, [locale, routeKey]);

  useEffect(() => {
    const handlePopState = () => {
      const nextResolvedPath = resolvePathname(
        window.location.pathname,
        preferredLocale,
      );

      if (nextResolvedPath.canonicalPath !== normalizePathname(window.location.pathname)) {
        window.history.replaceState(null, '', nextResolvedPath.canonicalPath);
      }

      if (nextResolvedPath.locale !== preferredLocale) {
        setPreferredLocale(nextResolvedPath.locale);
      }

      setPathname(nextResolvedPath.canonicalPath);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [preferredLocale]);

  useEffect(() => {
    let cancelled = false;
    const idleDisposers: Array<() => void> = [];
    const isHighTier = loadingMode === 'aggressive';
    const bootStartedAt = performance.now();
    const bootProfile = isHighTier
      ? {
        criticalTimeout: 1100,
        exitPauseMs: 180,
        finalMs: 220,
        firstStepMs: 180,
        minimumVisibleMs: 1900,
        preloadStepMs: 240,
        routeWarmTimeout: 2200,
        settleMs: 220,
      }
      : loadingMode === 'preload'
        ? {
            criticalTimeout: 820,
            exitPauseMs: 160,
            finalMs: 210,
            firstStepMs: 180,
            minimumVisibleMs: 1550,
            preloadStepMs: 240,
            routeWarmTimeout: 1200,
            settleMs: 220,
          }
        : {
            criticalTimeout: 700,
            exitPauseMs: 140,
            finalMs: 180,
            firstStepMs: 160,
            minimumVisibleMs: 1300,
            preloadStepMs: 210,
            routeWarmTimeout: 800,
            settleMs: 200,
          };

    const perFrameStep =
      motionTier === 'high'
        ? 1.34
        : motionTier === 'full'
          ? 1.18
          : motionTier === 'reduced'
            ? 0.96
            : 0.82;
    const smoothingFactor =
      motionTier === 'high'
        ? 0.15
        : motionTier === 'full'
          ? 0.135
          : motionTier === 'reduced'
            ? 0.12
            : 0.11;

    const setBootTarget = (target: number) => {
      bootTargetRef.current = Math.max(bootTargetRef.current, Math.min(100, target));
    };

    const smoothBootProgress = () => {
      const current = bootProgressRef.current;
      const target = bootTargetRef.current;
      const delta = target - current;

      if (delta > 0.02) {
        const next = Math.min(
          target,
          current + Math.min(perFrameStep, Math.max(0.18, delta * smoothingFactor)),
        );
        bootProgressRef.current = next;
        setBootProgress(next);
      } else if (current !== target) {
        bootProgressRef.current = target;
        setBootProgress(target);
      }

      if (!cancelled) {
        bootAnimationFrameRef.current = window.requestAnimationFrame(smoothBootProgress);
      } else {
        bootAnimationFrameRef.current = null;
      }
    };

    const waitForVisibleProgress = (target: number) =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (cancelled || bootProgressRef.current >= target - 0.35) {
            resolve();
            return;
          }

          window.requestAnimationFrame(check);
        };

        window.requestAnimationFrame(check);
      });

    const warmAggressiveResources = async () => {
      const tasks: Array<() => Promise<unknown>> = [
        () => loadFooter(),
        () => loadLearnMorePage(),
        () => loadNowPage(),
        () => loadFunPage(),
        () => loadProjectsPage(),
        () => loadSkillsPage(),
        () => loadAwardPage(),
        () => loadLinksPage(),
        () => loadNotFoundPage(),
        () => preloadImage('/Texturelabs_Grunge_219L-qOE4EmDy.png'),
        async () => {
          ensureResourceHint({
            rel: 'preload',
            href: '/videos/TNT.mp4',
            as: 'video',
            type: 'video/mp4',
          });
        },
      ];
      const baseTarget = 58;
      const endTarget = 90;
      const perTaskTimeout = Math.max(150, Math.floor(bootProfile.routeWarmTimeout / tasks.length));

      for (let index = 0; index < tasks.length; index += 1) {
        if (cancelled) return;

        const beforeTarget =
          baseTarget + ((endTarget - baseTarget) * (index + 0.42)) / tasks.length;
        const afterTarget =
          baseTarget + ((endTarget - baseTarget) * (index + 1)) / tasks.length;

        setBootTarget(beforeTarget);
        await waitForMs(26);
        if (cancelled) return;

        await settleWithTimeout([Promise.resolve().then(tasks[index])], perTaskTimeout);
        if (cancelled) return;

        setBootTarget(afterTarget);
        await waitForFrames(1);
      }
    };

    bootProgressRef.current = 0;
    bootTargetRef.current = 0;
    bootAnimationFrameRef.current = window.requestAnimationFrame(smoothBootProgress);

    const scheduleBackgroundPreloads = () => {
      const backgroundTasks: Array<() => Promise<unknown>> = [
        () => preloadImage('/Texturelabs_Grunge_219L-qOE4EmDy.png'),
      ];

      if (loadingMode !== 'lazy') {
        backgroundTasks.push(
          loadFooter,
          loadLearnMorePage,
          loadNowPage,
          loadFunPage,
          loadProjectsPage,
          loadSkillsPage,
          loadAwardPage,
          loadLinksPage,
          loadNotFoundPage,
        );
      }

      if (isHighTier) {
        backgroundTasks.push(
          async () => {
            ensureResourceHint({
              rel: 'preload',
              href: '/videos/TNT.mp4',
              as: 'video',
              type: 'video/mp4',
            });
          },
        );
      }

      backgroundTasks.forEach((task, index) => {
        idleDisposers.push(
          scheduleIdleTask(() => {
            void task();
          }),
        );

        if (index === 0 && loadingMode === 'lazy') {
          return;
        }
      });
    };

    const runBootSequence = async () => {
      setBootTarget(12);
      await waitForMs(bootProfile.firstStepMs);
      if (cancelled) return;

      setBootTarget(loadingMode !== 'lazy' ? 48 : 42);
      await settleWithTimeout([
        warmFont('800 1em MuseoModerno'),
        warmFont('700 1em Inter'),
        warmFont('700 1em Orbitron'),
        preloadImage('/头像.jpg'),
      ], bootProfile.criticalTimeout);
      if (cancelled) return;

      if (isHighTier) {
        setBootTarget(58);
        await warmAggressiveResources();
        if (cancelled) return;
      } else {
        setBootTarget(loadingMode === 'preload' ? 66 : 60);
        await waitForMs(bootProfile.preloadStepMs + 60);
        if (cancelled) return;
      }

      setBootTarget(isHighTier ? 96 : 84);
      await waitForFrames(1);
      if (cancelled) return;

      await waitForMs(bootProfile.settleMs);
      if (cancelled) return;

      setBootTarget(100);
      await waitForVisibleProgress(99.4);
      if (cancelled) return;

      await waitForMs(bootProfile.finalMs);
      if (cancelled) return;

      scheduleBackgroundPreloads();

      const visibleElapsed = performance.now() - bootStartedAt;
      const remainingVisible = bootProfile.minimumVisibleMs - visibleElapsed;
      if (remainingVisible > 0) {
        await waitForMs(remainingVisible);
      }

      await waitForMs(bootProfile.exitPauseMs);
      if (cancelled) return;

      setHideBootLoader(true);
      await waitForMs(LOADER_EXIT_MS);
      if (cancelled) return;

      setShowBootLoader(false);
    };

    void runBootSequence();

    return () => {
      cancelled = true;
      idleDisposers.forEach((dispose) => {
        dispose();
      });
      if (bootAnimationFrameRef.current) {
        window.cancelAnimationFrame(bootAnimationFrameRef.current);
      }
    };
  }, [loadingMode, motionTier]);

  const runRouteTransition = async ({
    historyMode,
    nextPath,
    targetScrollY,
    sourceElement,
    targetSelector,
  }: {
    historyMode: 'push' | 'replace';
    nextPath: string;
    targetScrollY?: number;
    sourceElement: HTMLElement;
    targetSelector?: string;
  }) => {
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;

    if (shouldSkipRouteAnimation) {
      if (historyMode === 'replace') {
        window.history.replaceState(null, '', nextPath);
      } else {
        window.history.pushState(null, '', nextPath);
      }

      setPathname(nextPath);

      if (typeof targetScrollY === 'number') {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: targetScrollY, behavior: 'auto' });
        });
      }

      transitionLockRef.current = false;
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const sourceCircle = getShapeFromElement(sourceElement);
    const fullscreenCircle = getFullscreenCircle(sourceCircle);

    setCircle({
      ...sourceCircle,
      transitionEnabled: false,
      visible: true,
    });

    await waitForFrames(1);

    setCircle({
      ...fullscreenCircle,
      transitionEnabled: true,
      visible: true,
    });

    await waitForMs(transitionExpandMs);

    if (historyMode === 'replace') {
      window.history.replaceState(null, '', nextPath);
    } else {
      window.history.pushState(null, '', nextPath);
    }

    setPathname(nextPath);

    await waitForFrames(2);

    if (typeof targetScrollY === 'number') {
      window.scrollTo({ top: targetScrollY, behavior: 'auto' });
      await waitForFrames(2);
    }

    const targetElement = targetSelector
      ? document.querySelector<HTMLElement>(targetSelector)
      : null;
    const targetCircle = targetElement
      ? getShapeFromElement(targetElement)
      : {
          backgroundColor: '#ffffff',
          borderRadius: '999px',
          height: 52,
          left: window.innerWidth / 2 - 26,
          top: window.innerHeight / 2 - 26,
          width: 52,
        };

    setCircle({
      ...fullscreenCircle,
      transitionEnabled: false,
      visible: true,
    });

    await waitForFrames(1);

    setCircle({
      ...targetCircle,
      transitionEnabled: true,
      visible: true,
    });

    await waitForMs(transitionContractMs);

    setCircle((current) => ({
      ...current,
      visible: false,
    }));

    if (typeof targetScrollY === 'number') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: targetScrollY, behavior: 'auto' });
        });
      });
    }

    transitionLockRef.current = false;
  };

  const openInternalPage = (
    nextRoute: Exclude<RouteKey, 'home'>,
    sourceElement: HTMLElement,
  ) => {
    homeScrollRef.current = window.scrollY;
    void runRouteTransition({
      historyMode: 'push',
      nextPath: paths[nextRoute],
      sourceElement,
      targetScrollY: 0,
      targetSelector: '.page-home-button',
    });
  };

  const returnFromInternalPage = (sourceElement: HTMLElement) => {
    if (routeKey === 'not-found' || routeKey === 'home') return;
    const targetSelector =
      HOME_ROUTE_SELECTORS[routeKey as Exclude<RouteKey, 'home'>] ??
      '.card-link-button-fun';

    void runRouteTransition({
      historyMode: 'replace',
      nextPath: paths.home,
      targetScrollY: homeScrollRef.current,
      sourceElement,
      targetSelector,
    });
  };

  const returnFromNotFound = (sourceElement: HTMLElement) => {
    void runRouteTransition({
      historyMode: 'replace',
      nextPath: paths.home,
      targetScrollY: 0,
      sourceElement,
    });
  };

  const persistLanguagePromptDismissed = () => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.languagePromptDismissed, 'true');
    } catch {
      // ignore persistence failures
    }

    setLanguagePromptDismissed(true);
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    persistLanguagePromptDismissed();
    const nextPath = switchLocalePath(pathname, nextLocale);
    setPreferredLocale(nextLocale);
    window.history.replaceState(null, '', nextPath);
    setPathname(nextPath);
  };

  const dismissLanguagePrompt = () => {
    persistLanguagePromptDismissed();
  };

  const acceptLanguagePrompt = () => {
    persistLanguagePromptDismissed();
    handleLocaleChange('zh-cn');
  };

  const handleCopyMobileNoticeUrl = async () => {
    const fallbackCopy = (text: string) => {
      const input = document.createElement('input');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.top = '50%';
      input.style.left = '50%';
      input.style.width = '1px';
      input.style.height = '1px';
      input.style.opacity = '0';
      input.style.border = '0';
      input.style.padding = '0';
      input.style.margin = '0';
      input.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(input);
      input.focus({ preventScroll: true });
      input.select();
      input.setSelectionRange(0, input.value.length);

      try {
        return document.execCommand('copy');
      } catch {
        return false;
      } finally {
        document.body.removeChild(input);
      }
    };

    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(copy.mobileNotice.url);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      copied = fallbackCopy(copy.mobileNotice.url);
    }

    setMobileNoticeCopied(copied);

    if (copied) {
      window.setTimeout(() => {
        setMobileNoticeCopied(false);
      }, 1600);
    }
  };

  const handleDismissMobileNotice = () => {
    setMobileNoticeDismissed(true);
  };

  let page: ReactNode = (
    <>
      <Hero copy={copy.hero} motionTier={motionTier} />
      <div className="app-container">
        <BentoGrid copy={copy.cards} paths={paths} onOpenInternalPage={openInternalPage} />
      </div>
      <DeferredFooter copy={copy.footer} mode={loadingMode} motionTier={motionTier} />
    </>
  );

  if (routeKey === 'about-me') {
    page = wrapLazyPage(
      <LearnMorePage
        copy={copy.about}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'now') {
    page = wrapLazyPage(
      <NowPage
        copy={copy.nowPage}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'fun') {
    page = wrapLazyPage(
      <FunPage
        homePath={paths.home}
        labels={copy.fun}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'projects') {
    page = wrapLazyPage(
      <ProjectsPage
        copy={copy.projectsPage}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        locale={locale}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'skills') {
    page = wrapLazyPage(
      <SkillsPage
        copy={copy.skillsPage}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'award') {
    page = wrapLazyPage(
      <AwardPage
        copy={copy.awardPage}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'links') {
    page = wrapLazyPage(
      <LinksPage
        copy={copy.linksPage}
        homeAriaLabel={copy.notFound.homeAria}
        homePath={paths.home}
        onReturnHome={returnFromInternalPage}
      />,
    );
  }

  if (routeKey === 'not-found') {
    page = wrapLazyPage(
      <NotFoundPage
        copy={copy.notFound}
        homePath={paths.home}
        onReturnHome={returnFromNotFound}
      />,
    );
  }

  const shouldShowMobileNotice =
    isMobileExperience &&
    !mobileNoticeDismissed &&
    (hideBootLoader || !showBootLoader);

  return (
    <>
      {showBootLoader ? (
        <StartupLoader
          exiting={hideBootLoader}
          locale={locale}
          motionTier={motionTier}
          progress={bootProgress}
        />
      ) : null}
      <div
        className="site-root"
        data-locale={locale}
        data-effective-contrast={effectiveContrast}
        data-motion-tier={motionTier}
      >
        {routeKey === 'home' ? (
          <SettingsMenu
            contrastMode={contrastMode}
            copy={copy.settings}
            languagePrompt={{
              onAccept: acceptLanguagePrompt,
              onDismiss: dismissLanguagePrompt,
              visible: showLanguagePrompt,
            }}
            locale={locale}
            onContrastChange={setContrastMode}
            onLocaleChange={handleLocaleChange}
          />
        ) : null}
        {page}
      </div>
      {shouldShowMobileNotice ? (
        <div className="mobile-notice-overlay" role="dialog" aria-modal="true">
          <div className="mobile-notice-panel">
            <p className="mobile-notice-message">{copy.mobileNotice.message}</p>
            <div className="mobile-notice-url-row">
              <p className="mobile-notice-url">{copy.mobileNotice.url}</p>
              <button
                className="mobile-notice-copy-button"
                onClick={handleCopyMobileNoticeUrl}
                type="button"
              >
                {mobileNoticeCopied ? copy.mobileNotice.copied : copy.mobileNotice.copy}
              </button>
            </div>
            <button
              className="mobile-notice-continue"
              onClick={handleDismissMobileNotice}
              type="button"
            >
              {copy.mobileNotice.continue}
            </button>
          </div>
        </div>
      ) : null}
      <div
        className={`route-transition-circle${circle.visible ? ' is-visible' : ''}${circle.transitionEnabled ? ' is-animated' : ''}`}
        aria-hidden="true"
        data-motion-tier={motionTier}
        style={{
          backgroundColor: circle.backgroundColor,
          borderRadius: circle.borderRadius,
          height: circle.height,
          left: circle.left,
          top: circle.top,
          width: circle.width,
        }}
      />
    </>
  );
}

export default App;
