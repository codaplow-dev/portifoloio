import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {projects} from "@/data/projects";
import {ProjectVisual} from "@/components/projects/ProjectVisual";
import {MotionLayer} from "@/components/MotionLayer";
export function generateStaticParams(){return projects.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(item=>item.slug===slug);return {title:(project?.title??"Projeto")+" — KODA",description:project?.description??"Projeto de Kawã Gonçalves."}}
export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=projects.find(item=>item.slug===slug);if(!project)notFound();return <><MotionLayer/><main className="inner-page shell project-detail"><Link href="/projects" className="back-link">← Voltar para Projetos</Link><header className="project-detail-header"><p className="eyebrow">{project.category} · 2026</p><h1>{project.title}</h1><p>{project.description}</p></header><ProjectVisual project={project} variant="detail"/><section className="case-content"><div><p className="eyebrow">01 / Contexto</p><h2>Uma estrutura preparada para o case.</h2></div><div><p>Esta página está pronta para receber contexto, problema, solução, funcionalidades, tecnologias e resultado do projeto.</p></div></section><section className="case-content"><div><p className="eyebrow">02 / Tecnologias</p><h2>{project.tags.join(" · ")}</h2></div><div><p>Links de Demo e GitHub entram aqui quando existirem.</p></div></section></main></>}
