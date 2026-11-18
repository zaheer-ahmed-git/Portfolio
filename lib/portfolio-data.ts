// Single source of truth for the portfolio content.
// Sources: candidate/*.yaml (profile, education, experience, skills, projects)
// and Github Fix/portfolioproj.md (repositories checked on GitHub, 2026-11-23).
// Only projects that exist on GitHub are listed. Metrics from the CVs are NOT
// shown here because they are not independently validated yet.

export const GITHUB_USER = "zaheer-ahmed-git";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const LINKEDIN_URL = "https://linkedin.com/in/zaheerahmedabbasi";
export const WEBSITE_URL = "https://zaheerai.pro/";
export const CONTACT_EMAIL = "dev.zaheer.ahmad@gmail.com";
export const LOCATION = "Calais, France";

export type ProjectCategory = "ai" | "fullstack" | "backend";

export interface PortfolioProject {
  title: string;
  description: string;
  tags: string[];
  categories: ProjectCategory[];
  repo: string; // exact GitHub repository name
  imageUrl?: string; // optional: a placeholder is shown when missing
  imageAlt: string;
}

export const projects: PortfolioProject[] = [
  {
    title: "Autonomous Research Agent",
    description:
      "Multi-agent research assistant built with LangGraph, FastAPI and Next.js. It gathers and analyses sources and produces citation-grounded reports, with task decomposition and memory management.",
    tags: ["LangGraph", "OpenAI", "FastAPI", "Next.js"],
    categories: ["ai", "fullstack"],
    repo: "ResearchMind-Autonomous-Multi-Agent-Research-Assistant",
    imageUrl: "/autonomous.png",
    imageAlt: "Autonomous Research Agent",
  },
  {
    title: "Multi-Agent Workflow Automation",
    description:
      "Multi-agent travel argumentation system with a custom orchestration layer, a quality-control reviewer gate and PostgreSQL-backed memory. Built with the OpenAI Agents SDK and FastAPI.",
    tags: ["OpenAI Agents SDK", "FastAPI", "PostgreSQL"],
    categories: ["ai", "backend"],
    repo: "LLM-Travel-Argumentation-Agent",
    imageUrl: "/multiagent.png",
    imageAlt: "Multi-Agent Workflow System",
  },
  {
    title: "RAG-Powered Knowledge Base",
    description:
      "Knowledge base with hybrid retrieval (FAISS vector search and BM25 keyword search, fused with RRF and diversified with MMR), knowledge-graph context and a FastAPI service.",
    tags: ["LlamaIndex", "FAISS", "BM25", "LangChain"],
    categories: ["ai", "backend"],
    repo: "RAG-Powered-Knowledge-Base",
    imageUrl: "/ragknow.png",
    imageAlt: "RAG Knowledge Base",
  },
  {
    title: "Real-time Call Semantic Analysis",
    description:
      "Call-centre analysis combining audio emotion (wav2vec2) and text sentiment to estimate sale probability. FastAPI backend with a Next.js dashboard.",
    tags: ["Python", "wav2vec2", "FastAPI", "Next.js"],
    categories: ["ai", "fullstack"],
    repo: "RealtimeCallSemanticAnalysis",
    imageAlt: "Real-time Call Semantic Analysis",
  },
  {
    title: "Vehicle Re-Identification",
    description:
      "Final-year project: vehicle re-identification from video with machine-learning models. FastAPI backend and Next.js frontend.",
    tags: ["Python", "FastAPI", "Next.js", "Computer Vision"],
    categories: ["ai", "fullstack"],
    repo: "VehicleReIdentification",
    imageAlt: "Vehicle Re-Identification",
  },
  {
    title: "Public Housing Maintenance ML",
    description:
      "Maintenance cost estimation and prioritisation of high-cost cases on public housing data, using XGBoost with a Streamlit interface.",
    tags: ["Python", "XGBoost", "Streamlit"],
    categories: ["ai"],
    repo: "Public_Housing_Maintenance_ML",
    imageAlt: "Public Housing Maintenance ML",
  },
  {
    title: "E-commerce Backend API",
    description:
      "Microservices e-commerce backend with FastAPI services, Stripe payments, Kafka event streaming, a Kong API gateway and Docker Compose.",
    tags: ["FastAPI", "Kafka", "Stripe", "Docker"],
    categories: ["backend"],
    repo: "Zaheer_Mart_Api",
    imageAlt: "E-commerce Backend API",
  },
  {
    title: "Modern E-commerce Store",
    description:
      "Responsive e-commerce storefront built with Next.js, React and TypeScript.",
    tags: ["Next.js", "React", "TypeScript"],
    categories: ["fullstack"],
    repo: "Ecommerce_Website",
    imageUrl: "/ecomstore.png",
    imageAlt: "Modern E-commerce Store",
  },
  {
    title: "French Listening Exercises",
    description:
      "Agent-driven French listening lessons on recent AI developments for B1–B2 learners, using Azure Speech, Blob Storage and MongoDB Atlas.",
    tags: ["Python", "Azure Speech", "MongoDB Atlas", "AI Agents"],
    categories: ["ai", "backend"],
    repo: "FrenchExercise-KnowledgeBuilding",
    imageAlt: "French Listening Exercises",
  },
  {
    title: "Weather Prediction System",
    description:
      "Flask app that takes user CSV data and predicts weather patterns with classical machine-learning models.",
    tags: ["Python", "Flask", "ML"],
    categories: ["ai", "backend"],
    repo: "Weather_Prediction_System_Using_Flask",
    imageUrl: "/weather.png",
    imageAlt: "Weather Prediction System",
  },
  {
    title: "Fullstack Task Manager",
    description:
      "Task manager with Next.js and FastAPI: create, edit and categorise tasks.",
    tags: ["Next.js", "React", "FastAPI"],
    categories: ["fullstack"],
    repo: "Fullstack_Todo_App",
    imageUrl: "/taskmanager.png",
    imageAlt: "Fullstack Task Manager",
  },
  {
    title: "Problem Solver AI Chatbot",
    description:
      "Chat interface built on OpenAI APIs and FastAPI that gives step-by-step solutions to problems across several domains.",
    tags: ["OpenAI", "FastAPI", "Next.js"],
    categories: ["ai", "fullstack"],
    repo: "PROBLEM_SOLVERAI",
    imageUrl: "/problem.png",
    imageAlt: "Problem Solver AI Chatbot",
  },
];

export const projectUrl = (repo: string) => `${GITHUB_URL}/${repo}`;

export interface ExperienceItem {
  title: string;
  employer: string;
  dates: string;
  location: string;
  bullets: string[];
}

// The six roles authorised as employment entries (candidate/experience.yaml).
export const experience: ExperienceItem[] = [
  {
    title: "Research and Development Intern",
    employer: "LISIC / Université du Littoral Côte d'Opale",
    dates: "Apr 2026 – Oct 2026",
    location: "Calais, France",
    bullets: [
      "Explainable AI for conversational medication recommendation.",
      "Transformer and graph architectures, evaluated on the MIMIC-IV clinical benchmark.",
    ],
  },
  {
    title: "Platform and Architecture Engineer",
    employer: "Renograte LLC",
    dates: "Dec 2025 – Apr 2026",
    location: "Remote",
    bullets: [
      "PropTech transaction SaaS and partner property ingestion.",
      "AI valuation workflows and subscription capabilities.",
    ],
  },
  {
    title: "Back-end Developer and Cloud System Architect",
    employer: "Thunderbird Technologies",
    dates: "Jul 2025 – Jan 2026",
    location: "Islamabad, Pakistan",
    bullets: [
      "FastAPI microservices and Kafka event streaming.",
      "Kong API Gateway, Azure deployment, Docker and Azure DevOps CI/CD.",
    ],
  },
  {
    title: "Artificial Intelligence Engineer",
    employer: "DataSAZ Solutions",
    dates: "Jan 2025 – Jun 2025",
    location: "Remote",
    bullets: [
      "Conversational AI for cyber-physical systems using edge-device logs and operational event data.",
    ],
  },
  {
    title: "AI Developer and Cloud Solutions",
    employer: "Renograte LLC",
    dates: "Oct 2024 – Jun 2025",
    location: "Remote",
    bullets: [
      "Generative AI prototypes, data pipelines and cloud setup.",
    ],
  },
  {
    title: "Software Developer Intern",
    employer: "Thunderbird Technologies",
    dates: "Jul 2024 – Sep 2024",
    location: "Islamabad, Pakistan",
    bullets: [
      "Cloud-hosted e-commerce backend services, database schemas and notification REST APIs.",
    ],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  dates: string;
  note?: string;
}

export const education: EducationItem[] = [
  {
    degree: "Master 2 – Ingénierie des Systèmes Complexes (MISC / ISC)",
    institution: "EILCO / Université du Littoral Côte d'Opale, Calais",
    dates: "2026 – 2027 (in progress)",
  },
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "PMAS Arid Agriculture University, Rawalpindi",
    dates: "2022 – 2026",
    note: "CGPA 3.62 / 4.0 (Bac+4 equivalence)",
  },
  {
    degree: "Generative AI Development Course",
    institution: "PIAIC",
    dates: "Jul 2023 – Jan 2026",
    note: "Hybrid training with hands-on projects",
  },
  {
    degree: "Intermediate in Computer Science (ICS / HSSC)",
    institution: "Board of Intermediate and Secondary Education, Rawalpindi",
    dates: "2020 – 2022",
    note: "Bac-equivalent. Physics, Computer Science, Statistics, Mathematics",
  },
];

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
}

export const certifications: CertificationItem[] = [
  { title: "Machine Learning with Python", issuer: "IBM", year: "2023" },
  { title: "Data Analysis with Python", issuer: "IBM", year: "2023" },
  { title: "Developing AI Applications with Python and Flask", issuer: "Coursera / IBM", year: "2024" },
  { title: "AWS Services for AI Solutions", issuer: "Coursera / IBM", year: "2026" },
];

export const skillGroups: { title: string; items: string[] }[] = [
  {
    title: "AI & Generative AI",
    items: ["LangChain", "LangGraph", "OpenAI Agents SDK", "CrewAI", "RAG pipelines", "Explainable AI", "Agentic AI"],
  },
  {
    title: "Machine Learning",
    items: ["Python", "PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "FAISS / BM25"],
  },
  {
    title: "Backend & Data",
    items: ["FastAPI", "Flask", "Kafka", "PostgreSQL", "Kong API Gateway", "Stripe"],
  },
  {
    title: "Frontend & Languages",
    items: ["Next.js", "React", "TypeScript / JavaScript"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Azure", "AWS", "Docker", "Git / CI/CD"],
  },
];

export const languages: { name: string; level: string }[] = [
  { name: "English", level: "Advanced" },
  { name: "French", level: "A2 (CEFR)" },
];
