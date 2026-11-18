import { BookOpen, GraduationCap, Award } from "lucide-react";
import { education, languages } from "@/lib/portfolio-data";

export const EducationSection = () => {
  return (
    <section id="education" className="py-16 md:py-20  bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#30193D]/30 to-transparent opacity-60"></div>
      <div className="container px-4 md:px-6 relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-black p-1 shadow-md shadow-[#444444] ring-1 ring-[#444444]">
            <div className="rounded-full bg-[#222222] p-2">
              <GraduationCap className="h-5 w-5 text-[#00FFFF]" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#F5F5F5]">Education & Learning</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00FFFF] to-[#30193D] rounded-full mx-auto"></div>
            <p className="max-w-[900px] text-[#D8BFD8] md:text-xl">
              Academic path and continuous learning in AI and computing
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center text-[#F5F5F5]">
              <GraduationCap className="mr-2 h-5 w-5 text-[#00FFFF]" />
              Academic Education
            </h3>

            {education.map((item) => (
              <div
                key={item.degree}
                className="bg-black/70 backdrop-blur-sm border border-[#444444] p-6 rounded-xl hover:border-[#00FFFF]/50 transition-colors group hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#222222] p-3 group-hover:bg-[#30193D]/30 transition-colors">
                    <BookOpen className="h-6 w-6 text-[#00FFFF]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="text-lg font-bold mb-1 text-[#F5F5F5] group-hover:text-[#00FFFF] transition-colors">
                        {item.degree}
                      </h4>
                      <span className="bg-[#30193D]/30 text-[#D8BFD8] text-xs px-2 py-1 rounded">{item.dates}</span>
                    </div>
                    <p className="text-[#00FFFF] text-sm mb-1">{item.institution}</p>
                    {item.note && <p className="text-[#D8BFD8] text-sm">{item.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center text-[#F5F5F5]">
              <Award className="mr-2 h-5 w-5 text-[#00FFFF]" />
              Languages
            </h3>

            <div className="bg-black/70 backdrop-blur-sm border border-[#444444] p-6 rounded-xl">
              <h4 className="text-lg font-bold mb-4 text-[#F5F5F5] flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#00FFFF]" /> Languages
              </h4>
              <ul className="space-y-2">
                {languages.map((lang) => (
                  <li key={lang.name} className="flex justify-between text-[#D8BFD8]">
                    <span>{lang.name}</span>
                    <span className="text-[#00FFFF]">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
