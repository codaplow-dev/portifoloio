export type Project = { slug:string; title:string; category:string; description:string; tags:string[]; tone:"blue"|"yellow"|"red"|"green"|"ink"; featured?:boolean; image?:string; imageAlt?:string; imagePosition?:string };
export const projects:Project[]=[
 {slug:"burgerflow",title:"BurgerFlow",category:"SaaS · Gestão de restaurantes",description:"Uma operação inteira de delivery em um só lugar — do cardápio ao painel administrativo.",tags:["Next.js","TypeScript","Supabase"],tone:"blue",featured:true},
 {slug:"los-bravos",title:"Los Bravos",category:"Experiência digital · Barbearia",description:"Marca, serviços e agendamento com atitude própria.",tags:["Web design","Frontend"],tone:"yellow"},
 {slug:"cachorrao-express",title:"Cachorrão Express",category:"Cardápio digital · Delivery",description:"Menos cliques entre fome e pedido.",tags:["E-commerce","WhatsApp"],tone:"red"},
 {slug:"rsso-gestao",title:"RSSô Gestão",category:"SaaS · Resíduos e MTR",description:"Dados complexos organizados para decisões mais simples.",tags:["Dashboard","Produto"],tone:"green"},
 {slug:"dashboard-processos",title:"Dashboard de Processos",category:"Sistema web · Operações",description:"Visão rápida do que importa para quem acompanha processos.",tags:["Data viz","UX"],tone:"ink"}
];
