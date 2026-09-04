import { PageIntro } from "@/components/layout/PageIntro";
import { technologyGroups } from "@/data/technologies";
import { TechnologyChip } from "@/components/technologies/TechnologyChip";

export const metadata = { title: "Tecnologias — KODA", description: "Ferramentas e tecnologias que utilizo para construir produtos digitais." };
export default function TechnologiesPage(){return <main className="inner-page shell"><PageIntro label="Tecnologias" title="Tecnologias" description="Ferramentas e tecnologias que utilizo para construir produtos digitais."/><section className="technology-groups">{technologyGroups.map(group=><section className="technology-group" key={group.label}><p className="eyebrow">{group.label}</p><div className="technology-grid">{group.items.map(item=><TechnologyChip item={item} key={item.id}/>)}</div></section>)}</section></main>}
