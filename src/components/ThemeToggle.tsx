"use client";

import { useEffect, useState } from "react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const THEME_DURATION = 550;

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isLight = saved === "light";
    setLight(isLight);
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
  }, []);

  function applyTheme(nextLight: boolean) {
    document.documentElement.dataset.theme = nextLight ? "light" : "dark";
    localStorage.setItem("theme", nextLight ? "light" : "dark");
    setLight(nextLight);
  }

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function fallbackTransition(nextLight: boolean) {
    const overlay = document.createElement("div");
    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    overlay.className = "theme-transition-overlay";
    overlay.dataset.theme = nextLight ? "light" : "dark";
    overlay.style.setProperty("--theme-radius", `${radius}px`);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("is-active"));
    window.setTimeout(() => {
      applyTheme(nextLight);
      overlay.remove();
    }, THEME_DURATION);
  }

  function toggle() {
    if (isTransitioning) return;

    const nextLight = !light;
    setIsTransitioning(true);

    if (reducedMotion()) {
      applyTheme(nextLight);
      setIsTransitioning(false);
      return;
    }

    const viewTransitionDocument = document as ViewTransitionDocument;
    if (!viewTransitionDocument.startViewTransition) {
      fallbackTransition(nextLight);
      setIsTransitioning(false);
      return;
    }

    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    document.documentElement.style.setProperty("--theme-radius", `${radius}px`);
    const transition = viewTransitionDocument.startViewTransition(() => applyTheme(nextLight));
    transition.finished.finally(() => setIsTransitioning(false));
  }

  return <button className="theme-toggle" onClick={toggle} disabled={isTransitioning} aria-label={light ? "Usar tema escuro" : "Usar tema claro"} data-cursor="link"><span>{light ? "☾" : "☼"}</span></button>;
}
