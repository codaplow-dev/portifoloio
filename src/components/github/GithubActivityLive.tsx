"use client";

import { useEffect, useRef, useState } from "react";
import type { Contribution, GitHubActivity } from "@/lib/github";
import { ContributionGraph } from "@/components/github/ContributionGraph";

type GithubActivityLiveProps = { initialContributions?: Contribution[]; initialError?: boolean; profileUrl: string };

export function GithubActivityLive({ initialContributions = [], initialError = false, profileUrl }: GithubActivityLiveProps) {
  const hasInitialData = initialContributions.length > 0;
  const [activity, setActivity] = useState<GitHubActivity | null>(hasInitialData ? { contributions: initialContributions, total: initialContributions.reduce((sum, item) => sum + item.count, 0), updatedAt: "" } : null);
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [hasError, setHasError] = useState(initialError && !hasInitialData);
  const requestInFlight = useRef(false);
  const hasDataRef = useRef(hasInitialData);
  const mounted = useRef(true);

  useEffect(() => {
    const refresh = async () => {
      if (requestInFlight.current) return;
      requestInFlight.current = true;
      if (!hasDataRef.current) setIsLoading(true);
      try {
        const response = await fetch("/api/github-activity", { cache: "no-store" });
        if (!response.ok) throw new Error("GitHub Activity request failed");
        const next = await response.json() as GitHubActivity;
        if (!Array.isArray(next.contributions)) throw new Error("Invalid GitHub Activity response");
        if (mounted.current) { hasDataRef.current = true; setActivity(next); setHasError(false); setIsLoading(false); }
      } catch {
        if (mounted.current) { setHasError(true); setIsLoading(false); }
      } finally { requestInFlight.current = false; }
    };
    if (!hasInitialData) refresh();
    const interval = window.setInterval(refresh, 60_000);
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { mounted.current = false; window.clearInterval(interval); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  if (activity?.contributions.length) return <ContributionGraph contributions={activity.contributions} total={activity.total} />;
  if (isLoading) return <div className="github-activity-row"><p>Carregando atividade do GitHub...</p></div>;
  return <div className="github-activity-row"><p>{hasError ? "Não foi possível carregar a atividade do GitHub agora." : "Contribuições públicas podem ser acompanhadas diretamente no perfil."}</p><a className="inline-link" href={profileUrl} target="_blank" rel="noopener noreferrer">{hasError ? "Ver perfil no GitHub" : "Ver atividade no GitHub"} <span>→</span></a></div>;
}

