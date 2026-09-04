import type { Contribution } from "@/lib/github";

type Week = { days: Contribution[]; monthLabel?: string; monthColumn?: number };

const dayMs = 24 * 60 * 60 * 1000;
const toUtcDate = (value: string) => new Date(`${value}T00:00:00Z`);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function buildWeeks(contributions: Contribution[]): Week[] {
  const sorted = [...contributions].sort((first, second) => first.date.localeCompare(second.date));
  const first = toUtcDate(sorted[0].date);
  const last = toUtcDate(sorted[sorted.length - 1].date);
  const start = new Date(first.getTime() - first.getUTCDay() * dayMs);
  const end = new Date(last.getTime() + (6 - last.getUTCDay()) * dayMs);
  const byDate = new Map(sorted.map(item => [item.date, item]));
  const weeks: Week[] = [];

  for (let cursor = start; cursor <= end; cursor = new Date(cursor.getTime() + 7 * dayMs)) {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(cursor.getTime() + index * dayMs);
      return byDate.get(isoDate(date)) ?? { date: isoDate(date), count: 0, level: 0 as const };
    });
    weeks.push({ days });
  }

  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const month = toUtcDate(week.days[0].date).getUTCMonth();
    if (month !== lastMonth) {
      week.monthLabel = monthNames[month];
      week.monthColumn = index + 1;
      lastMonth = month;
    }
  });

  return weeks;
}

const formatDate = (date: string) => new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(toUtcDate(date));

export function ContributionGraph({ contributions }: { contributions: Contribution[] }) {
  const weeks = buildWeeks(contributions);
  const total = contributions.reduce((sum, item) => sum + item.count, 0);

  return <div className="github-graph-shell">
    <div className="github-graph-scroll">
      <div className="github-months" style={{ "--week-count": weeks.length } as React.CSSProperties} aria-hidden="true">
        {weeks.map((week, index) => week.monthLabel ? <span key={`${week.monthLabel}-${index}`} style={{ gridColumn: week.monthColumn }}>{week.monthLabel}</span> : null)}
      </div>
      <div className="github-grid" style={{ "--week-count": weeks.length } as React.CSSProperties} aria-label="Calendário de contribuições do último ano">
        {weeks.flatMap((week, weekIndex) => week.days.map(day => <span key={day.date} className={`github-cell level-${day.level}`} title={day.count === 0 ? `Nenhuma contribuição em ${formatDate(day.date)}` : `${day.count} ${day.count === 1 ? "contribuição" : "contribuições"} em ${formatDate(day.date)}`} aria-label={day.count === 0 ? `Nenhuma contribuição em ${formatDate(day.date)}` : `${day.count} contribuições em ${formatDate(day.date)}`} />))}
      </div>
    </div>
    <p className="github-total">{total} contribuições no último ano</p>
  </div>;
}
