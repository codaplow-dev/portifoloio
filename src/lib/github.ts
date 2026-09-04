import "server-only";

export type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type GitHubActivity = { contributions: Contribution[]; total: number; updatedAt: string };

type GitHubResponse = { data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions: number; weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }> } } } }; errors?: Array<{ message?: string }> };
const levelMap: Record<string, Contribution["level"]> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const query = `query Contributions($login: String!, $from: DateTime!, $to: DateTime!) { user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
const isLevel = (value: string): value is keyof typeof levelMap => value in levelMap;

export async function getGitHubActivity(): Promise<GitHubActivity> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  const year = new Date().getFullYear();
  const from = `${year}-01-01T00:00:00Z`;
  const to = new Date().toISOString();
  if (process.env.NODE_ENV !== "production") console.info("[GitHub Activity] token configured:", Boolean(token), "from:", from, "to:", to);
  const response = await fetch("https://api.github.com/graphql", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ query, variables: { login: "codaplow-dev", from, to } }), cache: "no-store" });
  if (!response.ok) { const text = await response.text(); if (process.env.NODE_ENV !== "production") console.error("[GitHub GraphQL HTTP]", response.status, text); throw new Error(`GitHub GraphQL request failed: ${response.status}`); }
  const payload = (await response.json()) as GitHubResponse;
  if (payload.errors?.length) { if (process.env.NODE_ENV !== "production") console.error("[GitHub GraphQL errors]", payload.errors.map(error => error.message)); throw new Error(payload.errors[0].message ?? "GitHub GraphQL request failed"); }
  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("GitHub contribution calendar was not returned");
  const contributions = calendar.weeks.flatMap(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount, level: isLevel(day.contributionLevel) ? levelMap[day.contributionLevel] : 0 })));
  return { contributions, total: calendar.totalContributions, updatedAt: new Date().toISOString() };
}

export async function getGitHubContributions(): Promise<Contribution[]> { return (await getGitHubActivity()).contributions; }
