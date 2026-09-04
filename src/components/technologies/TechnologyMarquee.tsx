"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TechnologyItem } from "@/data/technologies";
import { TechnologyChip } from "@/components/technologies/TechnologyChip";

type TechnologyMarqueeProps = {
  items: TechnologyItem[];
  reverse?: boolean;
};

export function TechnologyMarquee({ items, reverse = false }: TechnologyMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [groupWidth, setGroupWidth] = useState(0);
  const repeatedItems = useMemo(() => Array.from({ length: repeatCount }, () => items).flat(), [items, repeatCount]);
  const copies = [0, 1, 2];

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = measureRef.current;
    if (!viewport || !group || items.length === 0) return;

    const measure = () => {
      const width = group.getBoundingClientRect().width;
      const requiredWidth = viewport.clientWidth * 1.25;
      const nextRepeatCount = width > 0 && width < requiredWidth ? Math.ceil(requiredWidth / width) : 1;
      setGroupWidth(width);
      setRepeatCount(current => current === nextRepeatCount ? current : nextRepeatCount);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, [items]);

  const trackStyle = {
    "--marquee-distance": `${groupWidth}px`,
    "--marquee-ready": groupWidth > 0 ? "running" : "paused",
  } as React.CSSProperties;

  return <div ref={viewportRef} className={`technology-marquee-viewport${groupWidth > 0 ? " is-ready" : ""}`} aria-label="Tecnologias utilizadas">
    <div ref={measureRef} className="technology-marquee-measure" aria-hidden="true">
      {items.map(item => <TechnologyChip item={item} key={`measure-${item.id}`} />)}
    </div>
    <div className={`technology-marquee-track${reverse ? " is-reverse" : ""}`} style={trackStyle}>
      {copies.map(copy => <div className="technology-marquee-group" aria-hidden={copy > 0} key={copy}>
        {repeatedItems.map((item, index) => <TechnologyChip item={item} key={`${copy}-${item.id}-${index}`} />)}
      </div>)}
    </div>
  </div>;
}



