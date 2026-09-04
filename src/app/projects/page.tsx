import type {Metadata} from "next";
import {projects} from "@/data/projects";
import {ProjectCard} from "@/components/ProjectCard";
import {PageIntro} from "@/components/layout/PageIntro";
export const metadata:Metadata={title:"Projetos — KODA",description:"Uma seleção de produtos, sistemas e experiências digitais que desenvolvi."};
export default function ProjectsPage(){return <main className="inner-page shell"><PageIntro label="01 / Projetos" title="Projetos" description="Uma seleção de produtos, sistemas e experiências digitais que desenvolvi."/><section className="projects-grid page-project-grid">{projects.map((project,index)=><ProjectCard key={project.slug} project={project} index={index+1}/>)}</section></main>}