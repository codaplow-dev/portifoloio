import Link from "next/link";
import {Project} from "@/data/projects";
import {ProjectVisual} from "@/components/projects/ProjectVisual";
export function ProjectCard({project,index}:{project:Project;index:number}){return <article className="project-card" data-reveal data-cursor="view"><Link href={"/projects/"+project.slug} className="project-link"><ProjectVisual project={project} variant="card"/><div className="project-card-info"><div><span className="project-index">0{index}</span><h3>{project.title}</h3><p>{project.category}</p></div><span className="project-arrow">↗</span></div><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></Link></article>}
