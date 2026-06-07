import { useEffect, useRef } from 'react';
import type { SiteCopy } from '../content/site';
import type { MotionTier } from '../App';

interface Shape {
  id: number;
  type: 'circle' | 'triangle' | 'square';
  x: number;
  y: number;
  size: number;
  gradient: string;
  opacity: number;
  depth: number;
  floatDelay: number;
  floatDuration: number;
  rotation: number;
}

const SHAPES: Shape[] = [
  // Large circles - flat 2D, multi-color gradients
  { id: 1, type: 'circle', x: 8, y: 15, size: 280, gradient: 'linear-gradient(135deg, #06d6a0, #118ab2)', opacity: 0.6, depth: 0.01, floatDelay: 0, floatDuration: 8, rotation: 0 },
  { id: 2, type: 'circle', x: 72, y: 5, size: 320, gradient: 'linear-gradient(160deg, #7209b7, #3a0ca3, #4361ee)', opacity: 0.55, depth: 0.012, floatDelay: 1.5, floatDuration: 9, rotation: 0 },
  { id: 3, type: 'circle', x: 50, y: 55, size: 200, gradient: 'linear-gradient(45deg, #f72585, #b5179e, #7209b7)', opacity: 0.5, depth: 0.015, floatDelay: 0.8, floatDuration: 7, rotation: 0 },
  { id: 4, type: 'circle', x: -5, y: 60, size: 220, gradient: 'linear-gradient(180deg, #2d6a4f, #40916c, #52b788)', opacity: 0.5, depth: 0.008, floatDelay: 2, floatDuration: 10, rotation: 0 },

  // Medium circles
  { id: 5, type: 'circle', x: 85, y: 50, size: 130, gradient: 'linear-gradient(120deg, #e63946, #f4a261)', opacity: 0.55, depth: 0.022, floatDelay: 1, floatDuration: 6, rotation: 0 },
  { id: 13, type: 'circle', x: 30, y: 45, size: 24, gradient: 'linear-gradient(90deg, #fbbf24, #f97316)', opacity: 0.7, depth: 0.048, floatDelay: 1.5, floatDuration: 5, rotation: 0 },

  // Squares - flat 2D multi-color gradient
  { id: 6, type: 'square', x: 65, y: 22, size: 45, gradient: 'linear-gradient(135deg, #fb923c, #f43f5e)', opacity: 0.65, depth: 0.035, floatDelay: 0.5, floatDuration: 5, rotation: 25 },
  { id: 7, type: 'square', x: 20, y: 75, size: 38, gradient: 'linear-gradient(135deg, #a78bfa, #ec4899)', opacity: 0.6, depth: 0.04, floatDelay: 2.5, floatDuration: 6, rotation: 45 },
  { id: 8, type: 'square', x: 80, y: 70, size: 28, gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)', opacity: 0.65, depth: 0.032, floatDelay: 1.2, floatDuration: 5.5, rotation: 12 },
  { id: 9, type: 'square', x: 42, y: 15, size: 22, gradient: 'linear-gradient(135deg, #a3e635, #14b8a6)', opacity: 0.7, depth: 0.045, floatDelay: 0.7, floatDuration: 4.5, rotation: 30 },
  { id: 14, type: 'square', x: 48, y: 38, size: 16, gradient: 'linear-gradient(135deg, #818cf8, #c084fc)', opacity: 0.7, depth: 0.05, floatDelay: 0.4, floatDuration: 4, rotation: 55 },

  // Triangles
  { id: 10, type: 'triangle', x: 35, y: 28, size: 42, gradient: 'linear-gradient(180deg, #34d399, #2dd4bf)', opacity: 0.6, depth: 0.034, floatDelay: 0.3, floatDuration: 6.5, rotation: 0 },
  { id: 11, type: 'triangle', x: 56, y: 80, size: 34, gradient: 'linear-gradient(180deg, #facc15, #fb923c)', opacity: 0.6, depth: 0.038, floatDelay: 1.8, floatDuration: 5, rotation: 30 },
  { id: 12, type: 'triangle', x: 12, y: 42, size: 26, gradient: 'linear-gradient(180deg, #fb7185, #e879f9)', opacity: 0.65, depth: 0.03, floatDelay: 2.2, floatDuration: 7, rotation: 60 },
];

function ShapeElement({
  motionTier,
  shape,
  shapeRef,
}: {
  motionTier: MotionTier;
  shape: Shape;
  shapeRef: (node: HTMLDivElement | null) => void;
}) {
  const base: React.CSSProperties = {
    position: 'absolute',
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: shape.size,
    height: shape.size,
    background: shape.gradient,
    opacity: shape.opacity,
    transform: `translate(0px, 0px) rotate(${shape.rotation}deg)`,
    animation:
      motionTier === 'full' || motionTier === 'high'
        ? `shapeFloat ${shape.floatDuration}s ease-in-out ${shape.floatDelay}s infinite`
        : 'none',
    willChange: motionTier === 'full' || motionTier === 'high' ? 'transform' : 'auto',
    transformOrigin: 'center center',
  };

  if (shape.type === 'circle') {
    return <div ref={shapeRef} style={{ ...base, borderRadius: '50%' }} />;
  }

  if (shape.type === 'square') {
    return <div ref={shapeRef} style={{ ...base, borderRadius: '6px' }} />;
  }

  // triangle
  return (
    <div style={{
      ...base,
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    }} ref={shapeRef} />
  );
}

export default function Footer({
  copy,
  motionTier,
}: {
  copy: SiteCopy['footer'];
  motionTier: MotionTier;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shapeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if ('fonts' in document) {
      void document.fonts.load('800 1em MuseoModerno');
    }

    if (motionTier !== 'full' && motionTier !== 'high') {
      if (titleRef.current) {
        titleRef.current.style.transform = 'translate(0px, 0px)';
      }
      shapeRefs.current.forEach((node, index) => {
        if (!node) return;
        node.style.transform = `translate(0px, 0px) rotate(${SHAPES[index].rotation}deg)`;
      });
      return;
    }

    let frame = 0;
    let isStageVisible = false;
    let isPointerTracking = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let pointerX = 0;
    let pointerY = 0;

    const applyTransforms = () => {
      frame = 0;

      const titleOffsetX = Math.round(-pointerX * 16);
      const titleOffsetY = Math.round(-pointerY * 8);

      if (titleRef.current) {
        titleRef.current.style.transform = `translate(${titleOffsetX}px, ${titleOffsetY}px)`;
      }

      shapeRefs.current.forEach((node, index) => {
        if (!node) return;
        const shape = SHAPES[index];
        const offsetX = Math.round(-pointerX * shape.depth * 800);
        const offsetY = Math.round(-pointerY * shape.depth * 400);
        node.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${shape.rotation}deg)`;
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(applyTransforms);
    };

    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const syncPointerToStage = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const nextPointerX = clamp((clientX - centerX) / (rect.width / 2));
      const nextPointerY = clamp((clientY - centerY) / (rect.height / 2));

      if (
        Math.abs(nextPointerX - pointerX) < 0.002 &&
        Math.abs(nextPointerY - pointerY) < 0.002
      ) {
        return;
      }

      pointerX = nextPointerX;
      pointerY = nextPointerY;
      scheduleUpdate();
    };

    const handlePointerMove = (e: PointerEvent) => {
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      if (!isStageVisible) return;
      syncPointerToStage(e.clientX, e.clientY);
    };

    const attachPointerTracking = () => {
      if (isPointerTracking) return;
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      isPointerTracking = true;
    };

    const detachPointerTracking = () => {
      if (!isPointerTracking) return;
      window.removeEventListener('pointermove', handlePointerMove);
      isPointerTracking = false;
    };

    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      scheduleUpdate();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isStageVisible = entry?.isIntersecting ?? false;

        if (!isStageVisible) {
          detachPointerTracking();
          resetPointer();
          return;
        }

        attachPointerTracking();
        syncPointerToStage(lastClientX, lastClientY);
      },
      { threshold: 0 }
    );

    observer.observe(stage);
    applyTransforms();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      detachPointerTracking();
    };
  }, [motionTier]);

  return (
    <footer className="footer-section">
      <div className="footer-stage" ref={stageRef}>
        <div className="footer-shapes">
          {SHAPES.map((shape, index) => (
            <ShapeElement
              key={shape.id}
              motionTier={motionTier}
              shape={shape}
              shapeRef={(node) => {
                shapeRefs.current[index] = node;
              }}
            />
          ))}
        </div>
        <h2 className="footer-title" ref={titleRef}>
          Lopleec
        </h2>
      </div>
      <div className="footer-meta">
        <p>
          {copy.intro}
          <a href="https://fridaybrain.com" target="_blank" rel="noreferrer">
            https://fridaybrain.com
          </a>
          {copy.middle}
          <a href="https://madebymanish.com" target="_blank" rel="noreferrer">
            https://madebymanish.com
          </a>
          {copy.afterSecond}
          <a href="https://rsms.me/inter" target="_blank" rel="noreferrer">
            https://rsms.me/inter
          </a>
          {copy.afterInter}
        </p>
        <p>{copy.copyright}</p>
      </div>
    </footer>
  );
}
