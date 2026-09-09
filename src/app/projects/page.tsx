import type {Metadata} from "next";
import {PageIntro} from "@/components/layout/PageIntro";
export const metadata:Metadata={title:"Projetos — KODA",description:"Estou preparando uma seleção dos trabalhos que melhor representam o que venho construindo."};
export default function ProjectsPage(){return <main className="inner-page shell"><PageIntro label="Projetos" title="Projetos" description="Estou preparando uma seleção dos trabalhos que melhor representam o que venho construindo."/></main>}
