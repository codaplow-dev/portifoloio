import { existsSync } from "node:fs";
import path from "node:path";
import { outsideInterests } from "@/data/profile";
import { PhotoStack } from "@/components/outside/PhotoStack";
const photos = ["outside-01.webp", "outside-02.webp", "outside-03.webp"].filter(name => existsSync(path.join(process.cwd(), "public/profile", name)));
export function OutsideCode(){return <section className="section shell outside-section" data-reveal><div className="outside-grid"><div><p className="eyebrow">Fora do código</p><h2>Fora do código</h2><p className="outside-copy">Quando saio do código, gosto de explorar outros interesses e voltar aos projetos com novas ideias e perspectivas.</p>{outsideInterests.length>0&&<div className="outside-interests">{outsideInterests.map(item=><span key={item}>{item}</span>)}</div>}</div>{photos.length>0&&<PhotoStack photos={photos.map(photo => ({ src: "/profile/" + photo, alt: "" }))}/>}</div></section>}
