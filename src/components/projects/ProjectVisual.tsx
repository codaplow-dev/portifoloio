import Image from "next/image";
import type { Project } from "@/data/projects";
import { VisualPlaceholder } from "@/components/VisualPlaceholder";

type ProjectVisualProps = {
  project: Project;
  variant?: "card" | "featured" | "detail";
};

export function ProjectVisual({ project, variant = "card" }: ProjectVisualProps) {
  const label = project.imageAlt ?? `${project.title} — preview do projeto`;
  if (!project.image) return <VisualPlaceholder tone={project.tone} large={variant !== "card"} label={label} />;
  return (
    <div className={`project-visual-media project-visual-media-${variant}`}>
      <Image src={project.image} alt={label} fill sizes={variant === "card" ? "(max-width: 760px) 100vw, 360px" : "(max-width: 760px) 100vw, 740px"} style={{ objectFit: "cover", objectPosition: project.imagePosition ?? "center" }} priority={variant === "featured"} />
    </div>
  );
}
