import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
  tags: string[];
  href: string;
}

const ProjectCard = ({ title, description, imageUrl, imageAlt, tags, href }: ProjectCardProps) => {
  return (
    <Card className="group h-full bg-black/70 backdrop-blur-sm border border-[#444444] hover:border-[#00FFFF]/50 transition-all duration-300 overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="relative overflow-hidden h-56 bg-gradient-to-br from-[#30193D] to-black">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center">
              <span className="text-[#00FFFF] font-mono text-sm">{"</> " + title}</span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1 gap-3">
          <h3 className="text-xl font-bold text-[#F5F5F5] group-hover:text-[#00FFFF] transition-colors">
            {title}
          </h3>
          <p className="text-[#D8BFD8] line-clamp-4 flex-1">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-[#00FFFF]/30 text-[#00FFFF] bg-[#30193D]/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#D8BFD8] hover:text-[#00FFFF] transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
