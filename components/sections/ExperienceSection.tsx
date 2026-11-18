import { Briefcase } from "lucide-react";
import { experience } from "@/lib/portfolio-data";

export const ExperienceSection = () => {
  return (
    <section id="experience" className="py-16 md:py-20  bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#30193D]/30 to-transparent opacity-60"></div>
      <div className="container px-4 md:px-6 relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-black p-1 shadow-md shadow-[#444444] ring-1 ring-[#444444]">
            <div className="rounded-full bg-[#222222] p-2">
              <Briefcase className="h-5 w-5 text-[#00FFFF]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F5F5F5]">Professional Experience</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00FFFF] to-[#30193D] rounded-full mx-auto"></div>
            <p className="max-w-[900px] text-[#D8BFD8] md:text-xl">
              Research, platform engineering and AI development roles since 2024
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experience.map((job) => (
            <div
              key={`${job.employer}-${job.title}`}
              className="bg-black/70 backdrop-blur-sm border border-[#444444] p-6 rounded-xl hover:border-[#00FFFF]/50 transition-colors group hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#222222] p-3 group-hover:bg-[#30193D]/30 transition-colors">
                  <Briefcase className="h-6 w-6 text-[#00FFFF]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h4 className="text-xl font-bold text-[#F5F5F5] group-hover:text-[#00FFFF] transition-colors">
                      {job.title}
                    </h4>
                    <span className="bg-[#30193D]/30 text-[#D8BFD8] text-xs px-2 py-1 rounded">{job.dates}</span>
                  </div>
                  <p className="text-[#00FFFF] text-sm mb-3">
                    {job.employer} · {job.location}
                  </p>
                  <ul className="space-y-2 text-[#D8BFD8] list-disc pl-5 mt-3">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
