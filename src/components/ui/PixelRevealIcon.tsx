"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type PixelRevealIconProps = { defaultSrc: string; hoverSrc: string; alt: string; size?: number; className?: string };
type Phase = "default" | "entering" | "hover" | "leaving";

const gridSize = 8;
const totalDuration = 330;
const maxDelay = 220;
const maxDiagonal = gridSize * 2 - 2;

function seededNoise(row: number, column: number) {
  const value = Math.sin(row * 12.9898 + column * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function PixelRevealIcon({ defaultSrc, hoverSrc, alt, size = 160, className = "" }: PixelRevealIconProps) {
  const maskId = `pixel-mask-${useId().replace(/:/g, "")}`;
  const pixels = useMemo(() => Array.from({ length: gridSize * gridSize }, (_, index) => {
    const column = index % gridSize;
    const row = Math.floor(index / gridSize);
    const diagonal = row + column;
    const noise = seededNoise(row, column);
    const score = (diagonal / maxDiagonal) * 0.7 + noise * 0.3;
    return { column, row, score, noise };
  }).sort((first, second) => first.score - second.score).map((pixel, index, ordered) => {
    const progress = ordered.length > 1 ? index / (ordered.length - 1) : 0;
    return { ...pixel, enterDelay: progress * maxDelay, leaveDelay: (1 - progress) * maxDelay, duration: 90 + pixel.noise * 50 };
  }), []);
  const tileRefs = useRef<Array<SVGRectElement | null>>([]);
  const animationsRef = useRef<Animation[]>([]);
  const desiredHoverRef = useRef(false);
  const runRef = useRef(0);
  const [phase, setPhase] = useState<Phase>("default");

  useEffect(() => () => animationsRef.current.forEach(animation => animation.cancel()), []);

  const transitionTo = (hovered: boolean) => {
    desiredHoverRef.current = hovered;
    const nextPhase: Phase = hovered ? "entering" : "leaving";
    const run = runRef.current + 1;
    runRef.current = run;
    animationsRef.current.forEach(animation => animation.cancel());
    animationsRef.current = [];
    if (!hovered && phase === "hover") tileRefs.current.forEach(tile => { if (tile) tile.style.opacity = "1"; });
    setPhase(nextPhase);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(hovered ? "hover" : "default"); return; }
    const target = hovered ? 1 : 0;
    const animations = tileRefs.current.map((tile, index) => {
      if (!tile) return null;
      const pixel = pixels[index];
      const current = Number.parseFloat(getComputedStyle(tile).opacity) || 0;
      const delay = hovered ? pixel.enterDelay : pixel.leaveDelay;
      return tile.animate([{ opacity: current }, { opacity: target }], { duration: pixel.duration, delay, easing: "steps(1, end)", fill: "forwards" });
    }).filter((animation): animation is Animation => animation !== null);
    animationsRef.current = animations;
    Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => {
      if (runRef.current !== run || desiredHoverRef.current !== hovered) return;
      animationsRef.current = [];
      setPhase(hovered ? "hover" : "default");
    });
  };

  return <div className={["pixel-reveal-icon", `pixel-reveal-icon-${phase}`, className].filter(Boolean).join(" ")} role="img" aria-label={alt} onPointerEnter={() => transitionTo(true)} onPointerLeave={() => transitionTo(false)} style={{ "--pixel-size": `${size}px` } as React.CSSProperties}>
    <img className="pixel-reveal-default-full" src={defaultSrc} alt="" draggable={false} />
    <img className="pixel-reveal-hover-full" src={hoverSrc} alt="" draggable={false} />
    <svg className="pixel-transition-layer" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs><mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="black" />{pixels.map((pixel, index) => <rect key={index} ref={tile => { tileRefs.current[index] = tile; }} className="pixel-reveal-mask-tile" x={pixel.column * (100 / gridSize) - 0.18} y={pixel.row * (100 / gridSize) - 0.18} width={100 / gridSize + 0.36} height={100 / gridSize + 0.36} fill="white" shapeRendering="crispEdges" />)}</mask></defs>
      <image href={hoverSrc} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" mask={`url(#${maskId})`} />
    </svg>
  </div>;
}
