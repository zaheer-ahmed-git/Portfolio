import { Brain } from "lucide-react";
import { skillGroups } from "@/lib/portfolio-data";

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-16 md:py-20  bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#30193D]/30 to-transparent opacity-50"></div>
      <div className="container px-4 md:px-6 relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-black p-1 shadow-md shadow-[#444444] ring-1 ring-[#444444]">
            <div className="rounded-full bg-[#222222] p-2">
              <Brain className="h-5 w-5 text-[#00FFFF]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F5F5F5]">Technical Skills</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00FFFF] to-[#30193D] rounded-full mx-auto"></div>
            <p className="max-w-[900px] text-[#D8BFD8] md:text-xl">
              Tools I use in AI research, backend engineering and cloud delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="p-5 rounded-lg border border-[#444444] bg-black/70 backdrop-blur-sm hover:border-[#00FFFF]/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
            >
              <h3 className="text-lg font-bold text-[#F5F5F5] mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="bg-[#30193D]/30 text-[#00FFFF] border border-[#444444] px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
