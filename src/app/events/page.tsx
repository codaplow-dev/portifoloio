import type {Metadata} from "next";
import {events} from "@/data/events";
import {PageIntro} from "@/components/layout/PageIntro";
export const metadata:Metadata={title:"Eventos — KODA",description:"Momentos, encontros e experiências fora do código."};
export default function EventsPage(){return <main className="inner-page shell"><PageIntro label="03 / Eventos" title="Eventos" description="Momentos, encontros e experiências fora do código."/>{events.length===0?<div className="empty-state"><span>Em breve</span><p>Eventos e registros serão adicionados em breve.</p></div>:<div className="events-grid">{events.map(event=><article key={event.id}><h2>{event.title}</h2><p>{event.description}</p></article>)}</div>}</main>}