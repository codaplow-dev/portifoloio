export type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GitHubContributionsResponse = {
  contributions?: unknown;
};

const endpoint = "https://github-contributions-api.jogruber.de/v4/codaplow-dev?y=last";

function isContribution(value: unknown): value is Contribution {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.date === "string"
    && typeof item.count === "number"
    && Number.isFinite(item.count)
    && Number.isInteger(item.count)
    && typeof item.level === "number"
    && Number.isInteger(item.level)
    && item.level >= 0
    && item.level <= 4;
}

export async function getGitHubContributions(): Promise<Contribution[]> {
  const response = await fetch(endpoint, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`GitHub contributions request failed: ${response.status}`);

  const data = (await response.json()) as GitHubContributionsResponse;
  if (!Array.isArray(data.contributions) || !data.contributions.every(isContribution)) {
    throw new Error("GitHub contributions response has invalid shape");
  }

  return data.contributions;
}
