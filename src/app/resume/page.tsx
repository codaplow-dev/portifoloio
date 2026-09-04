import { experience, education } from "@/data/experience";
import { profile, socialLinks } from "@/data/site";
import { technologies } from "@/data/technologies";
import { TechnologyChip } from "@/components/technologies/TechnologyChip";
import { PageIntro } from "@/components/layout/PageIntro";

export const metadata = { title: `Resumo — ${profile.brand}`, description: `${profile.name}, Software Developer.` };

export default function ResumePage() {
  return <main className="inner-page shell"><PageIntro label="Resumo profissional" title={profile.name} description="Software Developer focado em aplicações web, interfaces e produtos digitais." /><section className="resume-grid"><div><p className="eyebrow">Experiência</p>{experience.map(item => <article className="resume-item" key={item.id}><p className="resume-period">{item.period}</p><h2>{item.role}</h2><p className="company">{item.company}</p>{item.description?.map(text => <p className="muted" key={text}>{text}</p>)}</article>)}</div><div><p className="eyebrow">Formação</p>{education.map(item => <p className="resume-copy" key={item.title}><strong>{item.title}</strong><br/><span>{item.place}</span></p>)}<p className="eyebrow resume-label">Tecnologias</p><div className="tag-list resume-tags">{technologies.map(item => <TechnologyChip item={item} key={item.id}/>)}</div><p className="eyebrow resume-label">Contato</p><div className="resume-links">{socialLinks.map(link => <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>{link.label}</a>)}</div></div></section></main>
}
