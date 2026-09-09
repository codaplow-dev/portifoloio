import "server-only";

export type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type GitHubActivity = { contributions: Contribution[]; total: number; updatedAt: string };

type GitHubResponse = { data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions: number; weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }> } } } }; errors?: Array<{ message?: string }> };
const levelMap: Record<string, Contribution["level"]> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const query = `query Contributions($login: String!, $from: DateTime!, $to: DateTime!) { user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
const isLevel = (value: string): value is keyof typeof levelMap => value in levelMap;
async function getPublicGitHubActivity(login: string, year: number): Promise<GitHubActivity> {
  const today = new Date().toISOString().slice(0, 10);
  const response = await fetch(`https://github.com/users/${login}/contributions?from=${year}-01-01&to=${today}`, { cache: "no-store", headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`GitHub contributions page failed: ${response.status}`);
  const html = await response.text();
  const contributions: Contribution[] = [];
  const dayPattern = /<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[\s\S]*?<tool-tip[^>]*>([\s\S]*?)<\/tool-tip>/g;
  for (const match of html.matchAll(dayPattern)) {
    const countMatch = match[4].match(/(\d[\d,]*) contribution/);
    contributions.push({ date: match[1], count: countMatch ? Number(countMatch[1].replace(/,/g, "")) : 0, level: Number(match[3]) as Contribution["level"] });
  }
  if (!contributions.length) throw new Error("GitHub contribution calendar was not found");
  return { contributions, total: contributions.reduce((sum, item) => sum + item.count, 0), updatedAt: new Date().toISOString() };
}

export async function getGitHubActivity(): Promise<GitHubActivity> {
  const token = process.env.GITHUB_TOKEN;
  const year = new Date().getFullYear();
  if (!token) return getPublicGitHubActivity("itskodaplow", year);
  const from = `${year}-01-01T00:00:00Z`;
  const to = new Date().toISOString();
  if (process.env.NODE_ENV !== "production") console.info("[GitHub Activity] token configured:", Boolean(token), "from:", from, "to:", to);
  const response = await fetch("https://api.github.com/graphql", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ query, variables: { login: "itskodaplow", from, to } }), cache: "no-store" });
  if (!response.ok) { const text = await response.text(); if (process.env.NODE_ENV !== "production") console.error("[GitHub GraphQL HTTP]", response.status, text); throw new Error(`GitHub GraphQL request failed: ${response.status}`); }
  const payload = (await response.json()) as GitHubResponse;
  if (payload.errors?.length) { if (process.env.NODE_ENV !== "production") console.error("[GitHub GraphQL errors]", payload.errors.map(error => error.message)); throw new Error(payload.errors[0].message ?? "GitHub GraphQL request failed"); }
  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("GitHub contribution calendar was not returned");
  const contributions = calendar.weeks.flatMap(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount, level: isLevel(day.contributionLevel) ? levelMap[day.contributionLevel] : 0 })));
  return { contributions, total: calendar.totalContributions, updatedAt: new Date().toISOString() };
}

export async function getGitHubContributions(): Promise<Contribution[]> { return (await getGitHubActivity()).contributions; }
