import type { Contribution } from "@/lib/github";

type Week = { days: Contribution[]; monthLabel?: string; monthColumn?: number };
const dayMs = 24 * 60 * 60 * 1000;
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const toUtcDate = (value: string) => new Date(`${value}T00:00:00Z`);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

function buildWeeks(contributions: Contribution[], year: number): Week[] {
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year, 11, 31));
  const calendarStart = new Date(startOfYear.getTime() - startOfYear.getUTCDay() * dayMs);
  const calendarEnd = new Date(endOfYear.getTime() + (6 - endOfYear.getUTCDay()) * dayMs);
  const byDate = new Map(contributions.filter(item => item.date.startsWith(`${year}-`)).map(item => [item.date, item]));
  const weeks: Week[] = [];
  for (let cursor = calendarStart; cursor <= calendarEnd; cursor = new Date(cursor.getTime() + 7 * dayMs)) {
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(cursor.getTime() + index * dayMs); return byDate.get(isoDate(date)) ?? { date: isoDate(date), count: 0, level: 0 as const }; });
    weeks.push({ days });
  }
  for (let month = 0; month < 12; month += 1) {
    const firstDay = new Date(Date.UTC(year, month, 1));
    const weekIndex = Math.floor((firstDay.getTime() - calendarStart.getTime()) / (7 * dayMs));
    weeks[weekIndex].monthLabel = monthNames[month];
    weeks[weekIndex].monthColumn = weekIndex + 1;
  }
  return weeks;
}

const formatDate = (date: string) => new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(toUtcDate(date));

export function ContributionGraph({ contributions, total }: { contributions: Contribution[]; total?: number }) {
  const year = new Date().getFullYear();
  const weeks = buildWeeks(contributions, year);
  const contributionTotal = total ?? contributions.reduce((sum, item) => sum + item.count, 0);
  return <div className="github-graph-shell"><div className="github-graph-scroll"><div className="github-months" style={{ "--week-count": weeks.length } as React.CSSProperties} aria-hidden="true">{weeks.map((week, index) => week.monthLabel ? <span key={`${week.monthLabel}-${index}`} style={{ gridColumn: week.monthColumn }}>{week.monthLabel}</span> : null)}</div><div className="github-grid" style={{ "--week-count": weeks.length } as React.CSSProperties} aria-label={`Calendário de contribuições de ${year}`}>{weeks.flatMap(week => week.days.map(day => <span key={day.date} className={`github-cell level-${day.level}`} title={day.count === 0 ? `Nenhuma contribuição em ${formatDate(day.date)}` : `${day.count} ${day.count === 1 ? "contribuição" : "contribuições"} em ${formatDate(day.date)}`} aria-label={day.count === 0 ? `Nenhuma contribuição em ${formatDate(day.date)}` : `${day.count} contribuições em ${formatDate(day.date)}`} />))}</div></div><p className="github-total">{contributionTotal} contribuições em {year}</p></div>;
}