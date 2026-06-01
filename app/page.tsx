import Navbar from "@/components/layout/Navbar";
import CircuitBackground from "@/components/layout/CircuitBackground";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import EducationSection from "@/components/sections/EducationSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import Footer from "@/components/layout/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CircuitBackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <EducationSection />
      <ExperienceSection />
      <Footer />
    </div>
  );
}
