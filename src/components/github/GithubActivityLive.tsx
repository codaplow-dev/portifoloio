"use client";

import { useEffect, useState } from "react";
import type { Contribution, GitHubActivity } from "@/lib/github";
import { ContributionGraph } from "@/components/github/ContributionGraph";

export function GithubActivityLive({ initialContributions }: { initialContributions: Contribution[] }) {
  const [activity, setActivity] = useState<GitHubActivity>({ contributions: initialContributions, total: initialContributions.reduce((sum, item) => sum + item.count, 0), updatedAt: "" });
  useEffect(() => {
    let active = true;
    const refresh = async () => { try { const response = await fetch("/api/github-activity", { cache: "no-store" }); if (!response.ok) return; const next = await response.json() as GitHubActivity; if (active && Array.isArray(next.contributions)) setActivity(next); } catch { /* preserve last successful snapshot */ } };
    const interval = window.setInterval(refresh, 60_000);
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  return <ContributionGraph contributions={activity.contributions} total={activity.total} />;
}
