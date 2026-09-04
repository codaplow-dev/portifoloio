import { profile } from "@/data/profile";
import type { Contribution } from "@/lib/github";
import { GithubActivityLive } from "@/components/github/GithubActivityLive";

export function GithubActivity({ contributions, error = false }: { contributions?: Contribution[]; error?: boolean }) {
  return <section className="section shell github-activity" data-reveal>
    <div className="section-label"><span>GitHub Activity</span></div>
    <GithubActivityLive initialContributions={contributions ?? []} initialError={error || !contributions} profileUrl={profile.github} />
  </section>;
}
