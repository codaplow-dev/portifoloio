"use client";

import { useEffect, useRef, useState } from "react";

type PixelRevealIconProps = {
  defaultSrc: string;
  hoverSrc: string;
  alt: string;
  size?: number;
  className?: string;
};

const gridSize = 10;
const duration = 520;
type TransitionDirection = "enter" | "leave";

const tiles = Array.from({ length: gridSize * gridSize }, (_, index) => {
  const column = index % gridSize;
  const row = Math.floor(index / gridSize);
  const diagonal = row + column;
  const variation = (index * 17 + 11) % 3;
  return { column, row, order: diagonal * 10 + variation };
}).sort((first, second) => first.order - second.order);

function drawCoverImage(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  const sourceWidth = imageRatio > canvasRatio ? image.naturalHeight * canvasRatio : image.naturalWidth;
  const sourceHeight = imageRatio > canvasRatio ? image.naturalHeight : image.naturalWidth / canvasRatio;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.clearRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

export function PixelRevealIcon({ defaultSrc, hoverSrc, alt, size = 160, className = "" }: PixelRevealIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const defaultImageRef = useRef<HTMLImageElement>(null);
  const hoverImageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number | null>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const desiredHoverRef = useRef(false);
  const [visualState, setVisualState] = useState<"default" | "hover">("default");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const drawTransition = (direction: TransitionDirection, progress: number) => {
    const canvas = canvasRef.current;
    const defaultImage = defaultImageRef.current;
    const hoverImage = hoverImageRef.current;
    if (!canvas || !defaultImage || !hoverImage || !defaultImage.complete || !hoverImage.complete) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = Math.max(1, Math.round(canvas.clientWidth * window.devicePixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * window.devicePixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const source = sourceCanvasRef.current ?? document.createElement("canvas");
    sourceCanvasRef.current = source;
    source.width = width;
    source.height = height;
    const sourceContext = source.getContext("2d");
    if (!sourceContext) return;
    drawCoverImage(sourceContext, direction === "enter" ? hoverImage : defaultImage, width, height);

    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = false;
    const revealedCount = Math.ceil(progress * tiles.length);
    for (let index = 0; index < revealedCount; index += 1) {
      const tile = direction === "enter" ? tiles[index] : tiles[tiles.length - 1 - index];
      const x = Math.floor((tile.column * width) / gridSize);
      const y = Math.floor((tile.row * height) / gridSize);
      const nextX = Math.ceil(((tile.column + 1) * width) / gridSize);
      const nextY = Math.ceil(((tile.row + 1) * height) / gridSize);
      context.drawImage(source, x, y, nextX - x, nextY - y, x, y, nextX - x, nextY - y);
    }
  };

  const startTransition = (direction: TransitionDirection) => {
    setIsTransitioning(true);
    const startedAt = performance.now();
    const startingProgress = progressRef.current;
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const progress = startingProgress + (1 - startingProgress) * eased;
      progressRef.current = progress;
      drawTransition(direction, progress);
      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      frameRef.current = null;
      progressRef.current = 0;
      setVisualState(direction === "enter" ? "hover" : "default");
      setIsTransitioning(false);
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
  };

  const handlePointerEnter = () => {
    if (window.matchMedia("(hover: none)").matches || desiredHoverRef.current) return;
    desiredHoverRef.current = true;
    startTransition("enter");
  };

  const handlePointerLeave = () => {
    if (window.matchMedia("(hover: none)").matches || !desiredHoverRef.current) return;
    desiredHoverRef.current = false;
    startTransition("leave");
  };

  return (
    <div className={["pixel-reveal-icon", `pixel-reveal-icon-${visualState}`, isTransitioning ? "is-transitioning" : "", className].filter(Boolean).join(" ")} role="img" aria-label={alt} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} style={{ "--pixel-size": `${size}px` } as React.CSSProperties}>
      <img ref={defaultImageRef} className="pixel-reveal-image pixel-reveal-default-image" src={defaultSrc} alt="" draggable={false} />
      <img ref={hoverImageRef} className="pixel-reveal-image pixel-reveal-hover-image" src={hoverSrc} alt="" draggable={false} />
      <canvas ref={canvasRef} className="pixel-reveal-canvas" aria-hidden="true" />
    </div>
  );
}