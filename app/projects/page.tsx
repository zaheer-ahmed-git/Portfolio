"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Brain, Code, Server, Database, LucideIcon, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects, projectUrl, ProjectCategory } from "@/lib/portfolio-data";

interface Category {
  id: "all" | ProjectCategory;
  label: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "all", label: "All Projects", icon: Code },
  { id: "ai", label: "AI/ML", icon: Brain },
  { id: "fullstack", label: "Full-Stack", icon: Server },
  { id: "backend", label: "Backend", icon: Database },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category["id"]>("all");
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef);

  const filteredProjects = projects.filter(
    (project) => activeCategory === "all" || project.categories.includes(activeCategory)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            ref={headerRef}
            initial={{ y: 20, opacity: 0 }}
            animate={isHeaderInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center rounded-full bg-black p-1 shadow-md shadow-[#444444] ring-1 ring-[#444444] mx-auto">
              <div className="rounded-full bg-[#222222] p-2">
                <Database className="h-5 w-5 text-[#00FFFF]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F5]">
              All{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#30193D]">
                Projects
              </span>
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00FFFF] to-[#30193D] rounded-full mx-auto"></div>
            <p className="text-[#D8BFD8] max-w-2xl mx-auto">
              AI/ML, full-stack and backend projects. Each one links to its public GitHub repository.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categories.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      activeCategory === id
                        ? "bg-gradient-to-r from-[#00CED1] to-[#00FFFF] text-black"
                        : "bg-[#30193D]/30 text-[#D8BFD8] hover:bg-[#30193D]/50 border border-[#444444]"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.repo}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                imageAlt={project.imageAlt}
                tags={project.tags}
                href={projectUrl(project.repo)}
              />
            ))}
          </motion.div>

          <div className="flex justify-center mt-12">
            <Link href="/">
              <Button className="border-[#444444] text-[#F5F5F5] hover:bg-[#30193D]/30 hover:border-[#00FFFF] transition-colors bg-black/80 hover:text-[#00FFFF]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isHeaderInView ? { y: 0, opacity: 0 } : { y: -15, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-xl bg-black/70 backdrop-blur-sm border border-[#444444] hover:border-[#00FFFF]/50 transition-colors"
          >
            <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Core Technologies & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-[#00FFFF] font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5" /> AI & ML
                </h3>
                <ul className="text-[#D8BFD8] space-y-2">
                  <li>• PyTorch & TensorFlow</li>
                  <li>• scikit-learn & XGBoost</li>
                  <li>• Explainable AI</li>
                  <li>• Transformers & Graph models</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#00FFFF] font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Generative AI
                </h3>
                <ul className="text-[#D8BFD8] space-y-2">
                  <li>• LangChain & LangGraph</li>
                  <li>• OpenAI Agents SDK & CrewAI</li>
                  <li>• RAG pipelines (FAISS, BM25)</li>
                  <li>• LlamaIndex</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#00FFFF] font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" /> Frontend
                </h3>
                <ul className="text-[#D8BFD8] space-y-2">
                  <li>• Next.js & React</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[#00FFFF] font-semibold flex items-center gap-2">
                  <Server className="w-5 h-5" /> Backend & Cloud
                </h3>
                <ul className="text-[#D8BFD8] space-y-2">
                  <li>• FastAPI & Flask</li>
                  <li>• Kafka & Kong API Gateway</li>
                  <li>• PostgreSQL</li>
                  <li>• Azure, AWS, Docker</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
