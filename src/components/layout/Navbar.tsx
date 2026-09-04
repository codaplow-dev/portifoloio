"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ThemeToggle} from "@/components/ThemeToggle";
import {profile} from "@/data/profile";
const links=[{href:"/projects",label:"Projetos"},{href:"/experience",label:"Experiência"},{href:"/events",label:"Eventos"}];
export function Navbar(){const pathname=usePathname();return <nav className="nav shell"><Link href="/" className="brand">{profile.brand}</Link><div className="nav-links">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href||pathname.startsWith(link.href+"/")?"page":undefined}>{link.label}</Link>)}</div><ThemeToggle/></nav>}
