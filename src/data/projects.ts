export type Project = { slug:string; title:string; category:string; description:string; tags:string[]; tone:"blue"|"yellow"|"red"|"green"|"ink"; featured?:boolean; image?:string; imageAlt?:string; imagePosition?:string };
export const projects:Project[]=[];
