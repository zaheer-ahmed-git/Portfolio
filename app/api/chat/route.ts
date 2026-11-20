import { NextRequest, NextResponse } from 'next/server';
import { createStreamableUI } from '../../../lib/streaming';
import { ChatOpenAI } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { LRUCache } from 'lru-cache';

// The tokenizer lookup fails inside the Next bundle ("Unknown model") and only
// feeds usage statistics, so use a simple character-based estimate instead.
class PortfolioChatOpenAI extends ChatOpenAI {
  async getNumTokens(content: unknown): Promise<number> {
    const text = typeof content === 'string' ? content : JSON.stringify(content ?? '');
    return Math.ceil(text.length / 4);
  }
}

// Rate limiting implementation
interface RateLimitInfo {
  count: number;
  firstRequest: number;
  lastRequest: number;
  burstCount: number;
  burstStart: number;
  hourlyCount: number;
  hourlyStart: number;
}

// Configure rate limits with tiered approach
const RATE_LIMIT_CONFIG = {
  standard: {
    maxRequests: 3,    // 3 requests
    window: 60 * 1000, // Per minute
    cooldown: 2 * 60 * 1000 // 2 minute cooldown
  },
  burst: {
    maxRequests: 3,    // 3 requests
    window: 8 * 1000, // Per 8 seconds
    cooldown: 45 * 1000 // 45 second cooldown   
  },
  sustained: {
    maxRequests: 10,    // 10 requests
    window: 60 * 60 * 1000, // Per hour
    cooldown: 30 * 60 * 1000 // 30 minute cooldown
  }
};

// Store rate limit information by IP
const rateLimitCache = new LRUCache<string, RateLimitInfo>({
  max: 500, // Maximum number of IPs to track
  ttl: RATE_LIMIT_CONFIG.sustained.cooldown, // Auto-expire entries after the longest cooldown
});

// Enhanced rate limit check that applies multiple tiers
function checkRateLimit(ip: string): { limited: boolean; resetTime?: number; reason?: string } {
  const now = Date.now();
  
  // Get or initialize rate limit info for this IP
  let limitInfo = rateLimitCache.get(ip);
  if (!limitInfo) {
    limitInfo = {
      count: 1,
      firstRequest: now,
      lastRequest: now,
      burstCount: 1,
      burstStart: now,
      hourlyCount: 1,
      hourlyStart: now
    };
    rateLimitCache.set(ip, limitInfo);
    return { limited: false };
  }
  
  // Update the current stats
  limitInfo.lastRequest = now;
  
  // Check burst limit (short-term high frequency)
  const timeSinceBurstStart = now - limitInfo.burstStart;
  if (timeSinceBurstStart > RATE_LIMIT_CONFIG.burst.window) {
    // Reset burst window
    limitInfo.burstCount = 1;
    limitInfo.burstStart = now;
  } else {
    limitInfo.burstCount++;
    // Check if burst limit exceeded
    if (limitInfo.burstCount > RATE_LIMIT_CONFIG.burst.maxRequests) {
      const resetTime = limitInfo.burstStart + RATE_LIMIT_CONFIG.burst.cooldown;
      rateLimitCache.set(ip, limitInfo);
      return { 
        limited: true, 
        resetTime,
        reason: 'Too many requests in a short period'
      };
    }
  }
  
  // Check standard limit (minute-by-minute)
  const timeSinceStart = now - limitInfo.firstRequest;
  if (timeSinceStart > RATE_LIMIT_CONFIG.standard.window) {
    // Reset standard window
    limitInfo.count = 1;
    limitInfo.firstRequest = now;
  } else {
    limitInfo.count++;
    // Check if standard limit exceeded
    if (limitInfo.count > RATE_LIMIT_CONFIG.standard.maxRequests) {
      const resetTime = limitInfo.firstRequest + RATE_LIMIT_CONFIG.standard.cooldown;
      rateLimitCache.set(ip, limitInfo);
      return { 
        limited: true, 
        resetTime,
        reason: 'Rate limit exceeded, please try again later'
      };
    }
  }
  
  // Check sustained/hourly limit
  const timeSinceHourlyStart = now - limitInfo.hourlyStart;
  if (timeSinceHourlyStart > RATE_LIMIT_CONFIG.sustained.window) {
    // Reset hourly window
    limitInfo.hourlyCount = 1;
    limitInfo.hourlyStart = now;
  } else {
    limitInfo.hourlyCount++;
    // Check if hourly limit exceeded
    if (limitInfo.hourlyCount > RATE_LIMIT_CONFIG.sustained.maxRequests) {
      const resetTime = limitInfo.hourlyStart + RATE_LIMIT_CONFIG.sustained.cooldown;
      rateLimitCache.set(ip, limitInfo);
      return { 
        limited: true, 
        resetTime,
        reason: 'Hourly limit reached, please try again later'
      };
    }
  }
  
  // Update the cache with the new counts
  rateLimitCache.set(ip, limitInfo);
  return { limited: false };
}

// Load CV data directly as a string
const CV_DATA = `# Zaheer Ahmed

**Agentic AI Developer & Generative AI Engineer**
Calais, France
Email: dev.zaheer.ahmad@gmail.com
LinkedIn: linkedin.com/in/zaheerahmedabbasi
GitHub: https://github.com/zaheer-ahmed-git
Website: https://zaheerai.pro/

## Profile

Master 2 student in Complex Systems Engineering (EILCO / Université du Littoral Côte d'Opale, 2026-2027), with experience in explainable AI, RAG systems, multi-agent LLM applications, and cloud backend engineering. Completed a research and development internship at LISIC (Apr-Oct 2026) on explainable medication recommendation. Looking for a 6-month internship (stage) in France. Available for an internship from February 2027 (after 25 January 2027).

## Availability

- Zaheer is available for work from February 2027 (after 25 January 2027). He is looking for a 6-month internship (stage), in France first, including DevOps and cloud work (Docker, Azure, Azure DevOps CI/CD, Kafka, Kong).
- Contact: dev.zaheer.ahmad@gmail.com

## Education

- **Master 2 - Ingénierie des Systèmes Complexes (MISC / ISC)**, EILCO / Université du Littoral Côte d'Opale, Calais (2026-2027, in progress)
- **Bachelor of Science in Computer Science**, PMAS Arid Agriculture University, Rawalpindi (2022-2026), CGPA 3.62/4.0
- **Generative AI Development Course**, PIAIC (Jul 2023 - Jan 2026)
- **Intermediate in Computer Science (ICS / HSSC)**, Board of Intermediate and Secondary Education, Rawalpindi (2020-2022), Bac-equivalent

## Certifications

- Machine Learning with Python (IBM, 2023)
- Data Analysis with Python (IBM, 2023)
- Developing AI Applications with Python and Flask (Coursera / IBM, 2024)
- AWS Services for AI Solutions (Coursera / IBM, 2026)

## Skills

- **AI and Generative AI**: LangChain, LangGraph, OpenAI Agents SDK, CrewAI, RAG pipelines, Explainable AI, Agentic AI
- **Machine Learning**: Python, PyTorch, TensorFlow, scikit-learn, XGBoost, FAISS, BM25
- **Backend and Data**: FastAPI, Flask, Kafka, PostgreSQL, Kong API Gateway, Stripe
- **Frontend**: Next.js, React, TypeScript, JavaScript
- **Cloud and DevOps**: Azure, AWS, Docker, Git, CI/CD
- **Languages**: English (Advanced), French (A2 CEFR)

## Professional Experience

### LISIC / Université du Littoral Côte d'Opale, Calais
**Research and Development Intern** (Apr 2026 - Oct 2026)
- Explainable AI for conversational medication recommendation.
- Transformer and graph architectures, evaluated on the MIMIC-IV clinical benchmark.

### Renograte LLC (Remote)
**Platform and Architecture Engineer** (Dec 2025 - Apr 2026)
- PropTech transaction SaaS and partner property ingestion.
- AI valuation workflows and subscription capabilities.

### Thunderbird Technologies, Islamabad
**Back-end Developer and Cloud System Architect** (Jul 2025 - Jan 2026)
- FastAPI microservices and Kafka event streaming.
- Kong API Gateway, Azure deployment, Docker and Azure DevOps CI/CD.

### DataSAZ Solutions (Remote)
**Artificial Intelligence Engineer** (Jan 2025 - Jun 2025)
- Conversational AI for cyber-physical systems using edge-device logs and operational event data.

### Renograte LLC (Remote)
**AI Developer and Cloud Solutions** (Oct 2024 - Jun 2025)
- Generative AI prototypes, data pipelines and cloud setup.

### Thunderbird Technologies, Islamabad
**Software Developer Intern** (Jul 2024 - Sep 2024)
- Cloud-hosted e-commerce backend services, database schemas and notification REST APIs.

## Projects (public GitHub repositories)

- **Autonomous Research Agent** (LangGraph, FastAPI, Next.js): multi-agent research assistant producing citation-grounded reports. https://github.com/zaheer-ahmed-git/ResearchMind-Autonomous-Multi-Agent-Research-Assistant
- **Multi-Agent Workflow Automation** (OpenAI Agents SDK, FastAPI, PostgreSQL): orchestration layer with a quality-control reviewer gate and persistent memory. https://github.com/zaheer-ahmed-git/LLM-Travel-Argumentation-Agent
- **RAG-Powered Knowledge Base** (LlamaIndex, FAISS, BM25, LangChain): hybrid retrieval with RRF and MMR, knowledge-graph context. https://github.com/zaheer-ahmed-git/RAG-Powered-Knowledge-Base
- **Real-time Call Semantic Analysis** (wav2vec2, FastAPI, Next.js): audio emotion and text sentiment to estimate sale probability. https://github.com/zaheer-ahmed-git/RealtimeCallSemanticAnalysis
- **Vehicle Re-Identification** (final-year project, FastAPI, Next.js): vehicle re-identification from video. https://github.com/zaheer-ahmed-git/VehicleReIdentification
- **Public Housing Maintenance ML** (XGBoost, Streamlit): maintenance cost estimation and high-cost prioritisation. https://github.com/zaheer-ahmed-git/Public_Housing_Maintenance_ML
- **E-commerce Backend API** (FastAPI, Kafka, Stripe, Kong, Docker Compose): microservices backend. https://github.com/zaheer-ahmed-git/Zaheer_Mart_Api
- **French Listening Exercises** (Azure Speech, MongoDB Atlas): agent-driven French listening lessons for B1-B2 learners. https://github.com/zaheer-ahmed-git/FrenchExercise-KnowledgeBuilding
- **Weather Prediction System** (Flask, ML): CSV-based weather pattern prediction. https://github.com/zaheer-ahmed-git/Weather_Prediction_System_Using_Flask

## Interests

- Explainable and contestable LLM systems, structured-evidence RAG, conversational recommendation, sequence and graph ranking fusion, evaluation of LLM-generated explanations.

## Contact

- **Email**: dev.zaheer.ahmad@gmail.com
- **LinkedIn**: linkedin.com/in/zaheerahmedabbasi
- **GitHub**: github.com/zaheer-ahmed-git`;

// Initialize the vector store and retriever - this happens once when the API route is first loaded
let vectorStore: MemoryVectorStore;
let retriever: ReturnType<MemoryVectorStore['asRetriever']>;
let initialized = false;
let initializing = false;

// Setup a response cache with LRU strategy
const responseCache = new LRUCache<string, string>({
  max: 100, // Store up to 100 query/response pairs
  ttl: 1000 * 60 * 60, // Cache for 1 hour
});

// Pre-compute common question categories for faster retrieval
const COMMON_TOPICS = [
  "skills", "experience", "education", "contact", "projects", 
  "background", "certifications", "technologies"
];

// Optimized chunk settings for better retrieval
const CHUNK_CONFIG = {
  chunkSize: 500,     // Larger chunks to reduce fragmentation
  chunkOverlap: 100,  // Higher overlap for better context preservation
  separators: ["\n\n", "\n", "## ", "# ", "### ", "- ", "**", "*", ":", "."],
};

async function initializeRetriever() {
  if (initialized) return true;
  if (initializing) {
    // Wait for initialization to complete if already in progress
    while (initializing) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return initialized;
  }
  
  initializing = true;
  
  if (!process.env.OPENAI_API_KEY) {
    initializing = false;
    throw new Error("OPENAI_API_KEY is not set in the environment variables");
  }

  try {
    // Create a text splitter with optimized settings
    const textSplitter = new RecursiveCharacterTextSplitter(CHUNK_CONFIG);

    // Split CV data into chunks
    const cvDocument = new Document({ pageContent: CV_DATA });
    const docs = await textSplitter.splitDocuments([cvDocument]);
    console.log(`Split CV into ${docs.length} chunks`);

    // Use OpenAI embeddings with optimization
    const embeddings = new OpenAIEmbeddings({
      stripNewLines: true, // Remove newlines for better embedding quality
    });
    
    // Create a vector store from the documents
    vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    
    // Create a retriever with optimized settings
    retriever = vectorStore.asRetriever({
      searchType: "similarity",
      k: 4, // Retrieve more chunks for better context
      filter: undefined, // No filtering for this small dataset
    });

    // Pre-warm the cache with common queries
    await Promise.all(COMMON_TOPICS.map(async (topic) => {
      const query = `Tell me about Zaheer's ${topic}`;
      // We don't need to store results here, just trigger the embeddings calculation
      await vectorStore.similaritySearch(query, 3);
    }));

    console.log("Retriever initialized successfully");
    initialized = true;
    initializing = false;
    return true;
  } catch (error) {
    console.error("Error initializing retriever:", error);
    initializing = false;
    throw error;
  }
}

// Define the system prompt for the chatbot
const SYSTEM_TEMPLATE = `You are a helpful, professional assistant for Zaheer Ahmed, an Agentic AI Developer & Cloud Generative AI Engineer.
Your role is to provide information about Zaheer's experience, skills, projects, and professional background based on his CV.
Be friendly, concise, and informative.

Use ONLY the following context to answer questions about Zaheer Ahmed:
{context}

If the question falls outside of information about Zaheer Ahmed contained in the context, politely explain that you can only provide information about Zaheer's skills, experience, and professional background.
Avoid making up information not present in the context.`;

// Initialize retriever when the API route module is loaded
initializeRetriever().catch(console.error);

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (rateLimitResult.limited) {
      const resetTime = rateLimitResult.resetTime || Date.now() + RATE_LIMIT_CONFIG.standard.cooldown;
      const secondsToReset = Math.ceil((resetTime - Date.now()) / 1000);
      const reason = rateLimitResult.reason || 'Rate limit exceeded';
      
      return NextResponse.json({
        error: `${reason}. Please try again in ${secondsToReset} seconds.`
      }, {
        status: 429,
        headers: {
          'Retry-After': secondsToReset.toString(),
          'X-Rate-Limit-Reason': reason
        }
      });
    }
    
    // Make sure we have initialized the retriever successfully
    if (!initialized) {
      try {
        await initializeRetriever();
      } catch (error) {
        console.error("Error initializing retriever on demand:", error);
        // Fallback to basic response when retriever fails
        return NextResponse.json({ 
          error: "Service initialization failed. Please try again later." 
        }, { status: 503 });
      }
      
      // If still not initialized after attempt, return error
      if (!initialized || !retriever) {
        return NextResponse.json({ 
          error: "Service temporarily unavailable" 
        }, { status: 503 });
      }
    }

    // Parse the request
    const { query } = await req.json();

    // Ensure valid input
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    // Set up the streaming
    const { stream, writer } = createStreamableUI();

    // Process the query asynchronously
    (async () => {
      try {
        // Check if we already have a cached response
        const cachedResponse = responseCache.get(query.toLowerCase().trim());
        if (cachedResponse) {
          // Stream the cached response
          const words = cachedResponse.split(' ');
          for (const word of words) {
            writer.write(word + ' ');
            // Small delay to simulate streaming for cached responses
            await new Promise(resolve => setTimeout(resolve, 10));
          }
          writer.close();
          return;
        }

        let fullResponse = '';
        
        // Create the model with optimized settings
        const model = new PortfolioChatOpenAI({
          modelName: "gpt-6-luna", // gpt-3.5-turbo is deprecated and returns 404 model_not_found
           // Lower temperature for more deterministic responses
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken: (token: string) => {
                writer.write(token);
                fullResponse += token; // Collect response directly here
              },
            },
          ],
        });

        try {
          // Validate retriever is properly initialized
          if (!retriever) {
            throw new Error("Retriever is not initialized properly");
          }

          // Create a simpler prompt template for faster processing
          const prompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE],
            ["human", "{input}"],
          ]);

          // Create the document chain
          const documentChain = await createStuffDocumentsChain({
            llm: model,
            prompt,
          });

          // Create the retrieval chain with optimized settings
          const retrievalChain = await createRetrievalChain({
            combineDocsChain: documentChain,
            retriever,
          });

          // Execute the chain
          await retrievalChain.invoke({
            input: query,
            chat_history: [], // No chat history for now for faster responses
          });

          // Cache the response for future use
          responseCache.set(query.toLowerCase().trim(), fullResponse);
        } catch (error) {
          console.error("Chain error:", error);
          
          // Fallback to direct response when chain fails
          const fallbackResponse = "I'm sorry, I'm having trouble retrieving information at the moment. Could you try a different question or try again later?";
          writer.write(fallbackResponse);
          
          // We don't cache error responses
        }

        // Close the writer when done
        writer.close();
      } catch (error) {
        console.error("Error in stream processing:", error);
        writer.write("\nSorry, I encountered an error while processing your request.");
        writer.close();
      }
    })();

    // Return the stream
    return new Response(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
