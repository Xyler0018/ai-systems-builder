import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_DB_TOOLS !== "true") {
  throw new Error("Refusing to run seed in production without ALLOW_PRODUCTION_DB_TOOLS=true.");
}

const phases = [
  {
    name: "Setup Week",
    goal: "Create a serious learning environment and main GitHub repository before starting the 12-month execution plan.",
    coreSkills: "Python environment setup, GitHub, Docker hello-world, repository structure, templates, proof discipline.",
    tools: "Python 3.11+, VS Code or Cursor, Git, GitHub, Docker, Docker Compose, Postman or Bruno, SQLite Browser, Jupyter, Ollama, Open WebUI, n8n, Google Colab, Kaggle, Hugging Face.",
    requiredDeliverables: "main GitHub repo, README.md, learning-log.md, weekly-review-template.md, project-checklist.md.",
    successCondition: "You can create a virtual environment, install packages, run a script, commit to GitHub, run Docker hello-world, and open the repo from another browser/device."
  },
  {
    name: "Python, GitHub, Files, APIs and Testing",
    goal: "Become comfortable writing useful Python programs and documenting them. Do not touch advanced AI yet.",
    coreSkills: "Python basics, files, JSON, CSV, APIs, HTTP, environment variables, error handling, pytest, logging, README writing.",
    tools: "Python, Git, GitHub, venv or uv, pytest, requests, JSON/CSV tooling.",
    requiredDeliverables: "Python mini projects, CSV/JSON tools, API projects, Personal Productivity CLI, README files, tests, GitHub proof.",
    successCondition: "Someone else can clone the repo, run the CLI, see example outputs, and verify at least 5 tests pass."
  },
  {
    name: "Data, SQL, Practical ML and Backend Basics",
    goal: "Learn enough data, SQL, and ML to understand AI systems and prepare real datasets.",
    coreSkills: "pandas, NumPy, SQLite, SQL queries, visualization, train/test split, model evaluation, scikit-learn, FastAPI intro.",
    tools: "Jupyter Notebook, pandas, NumPy, SQLite, matplotlib or similar charts, scikit-learn, joblib, Streamlit, FastAPI.",
    requiredDeliverables: "Student Performance Analysis, Sales Dashboard Notebook, House Price Prediction, Student Score Predictor with FastAPI endpoint.",
    successCondition: "You can analyze a business dataset, train and evaluate a model, save it, expose a basic prediction endpoint, and explain model limitations."
  },
  {
    name: "Deep Learning, NLP and Hugging Face",
    goal: "Understand neural networks and modern pretrained models enough to use them correctly without going too deep too early.",
    coreSkills: "tensors, datasets, dataloaders, training loops, optimizers, tokenization, embeddings, sentiment analysis, Hugging Face pipelines.",
    tools: "PyTorch, Hugging Face Transformers, sentence-transformers, Google Colab, Kaggle.",
    requiredDeliverables: "MNIST Digit Classifier, Clothing Image Classifier, Review Sentiment Classifier, AI Text Summarizer.",
    successCondition: "You can explain epochs, batches, loss, optimizer, tokenization, embeddings, and model limitations."
  },
  {
    name: "LLM Apps, Local AI, Prompt Engineering and Memory",
    goal: "Build practical LLM apps, understand local vs cloud model tradeoffs, and add memory/storage.",
    coreSkills: "system prompts, context windows, temperature, structured output, tool calling basics, prompt testing, chat history, short-term and long-term memory.",
    tools: "OpenAI or another API model, Ollama, Open WebUI, SQLite, FastAPI or Streamlit, Pydantic.",
    requiredDeliverables: "Simple LLM Chat Application, Local AI Assistant, AI Business Document Assistant, Personal Study Assistant with Memory.",
    successCondition: "The LLM app handles errors, logs behavior, stores useful history, and can explain local/cloud model tradeoffs."
  },
  {
    name: "RAG Systems",
    goal: "Build reliable retrieval systems with source-backed answers and citation discipline.",
    coreSkills: "document loading, chunking, metadata, embeddings, vector databases, semantic search, citations, query handling, hallucination reduction.",
    tools: "sentence-transformers, ChromaDB or Qdrant, FAISS, LangChain or LlamaIndex, PDF tooling.",
    requiredDeliverables: "Semantic Search over Notes, PDF Q&A Bot, PDF Q&A Bot v2 with citations/page references, Company Knowledge Assistant.",
    successCondition: "The assistant answers from sources, says when the answer is not found, and displays citations or source chunks."
  },
  {
    name: "AI Agents, n8n, FastAPI and Docker",
    goal: "Connect controlled agents, workflow automation, API backends, and deployment packaging.",
    coreSkills: "tool calling, planning, state, retries, stopping conditions, human approval, n8n workflows, FastAPI endpoints, Docker, Docker Compose.",
    tools: "LangGraph or similar controlled agent framework, n8n, webhooks, FastAPI, Pydantic, Docker, Docker Compose.",
    requiredDeliverables: "Research Assistant Agent, AI Email Reply Assistant with human approval, RAG API Backend, Dockerized AI Application.",
    successCondition: "Automation has human approval before sending or modifying anything, and the API/backend can run in Docker."
  },
  {
    name: "Portfolio Hardening",
    goal: "Polish working projects into explainable portfolio assets with READMEs, diagrams, demos, tests, and limitations.",
    coreSkills: "case-study writing, README quality, architecture explanation, testing, demo recording, project cleanup.",
    tools: "GitHub, Markdown, diagrams, screenshots, demo video tooling, project docs.",
    requiredDeliverables: "Polished portfolio projects with problem statement, target user, architecture, stack, run commands, limitations, and next improvements.",
    successCondition: "A reviewer can understand what each project solves, run it, and see proof of engineering quality."
  },
  {
    name: "Real Business Automation System",
    goal: "Build a real business-facing automation that combines AI, workflow orchestration, storage, and human approval.",
    coreSkills: "business workflow mapping, n8n, webhooks, structured output, approval flows, notifications, error branches.",
    tools: "Python, API model, n8n, Google Sheets, FastAPI webhook, Docker, Slack/Telegram/Gmail integrations.",
    requiredDeliverables: "AI Lead Research and Outreach Assistant or equivalent real workflow automation.",
    successCondition: "The tool solves a real workflow problem and can be demoed end-to-end."
  },
  {
    name: "Specialization and Service Packaging",
    goal: "Package your specialization as a RAG + AI Automation Systems Specialist.",
    coreSkills: "service positioning, case studies, demo videos, architecture diagrams, before/after workflow explanation.",
    tools: "GitHub profile README, portfolio homepage, case-study pages, demo videos.",
    requiredDeliverables: "Portfolio homepage or GitHub profile README, 3 case studies, service descriptions, demo videos, architecture diagrams.",
    successCondition: "Your positioning clearly sells working AI systems, not generic AI learning or prompt tinkering."
  },
  {
    name: "Advanced RAG and Evaluation",
    goal: "Become deeper in RAG quality by evaluating retrieval, citations, hallucinations, and failure modes.",
    coreSkills: "hybrid search, metadata filtering, reranking, query rewriting, evaluation datasets, retrieval accuracy, citation correctness, OCR basics, table extraction basics.",
    tools: "Vector database, rerankers, evaluation spreadsheets or scripts, OCR/table extraction tools, LangChain or LlamaIndex.",
    requiredDeliverables: "Advanced RAG Evaluation System with test questions, expected answers, retrieved chunks, generated answers, scores, and failure analysis.",
    successCondition: "You can debug why RAG gives bad answers and improve retrieval instead of randomly changing prompts."
  },
  {
    name: "Fine-Tuning and MLOps Basics",
    goal: "Understand model adaptation practically without becoming obsessed with fine-tuning.",
    coreSkills: "fine-tuning vs RAG, LoRA, QLoRA, instruction datasets, classification fine-tuning, evaluation, MLflow, model versioning.",
    tools: "Google Colab or cloud GPU, small open model, MLflow, experiment tracking artifacts.",
    requiredDeliverables: "Small Fine-Tuning Experiment and MLflow Experiment Tracking Demo.",
    successCondition: "You understand when fine-tuning is useful and when RAG or prompting is enough."
  },
  {
    name: "Production AI Engineering Flagship",
    goal: "Build the strongest portfolio project: a production-style AI knowledge and workflow assistant.",
    coreSkills: "frontend, FastAPI backend, database, authentication basics, uploads, RAG, chat history, citations, n8n integration, logs, evaluation, security, Docker Compose.",
    tools: "Frontend or Streamlit, FastAPI, database, vector database, embedding model, LLM, n8n, Docker Compose, logging/evaluation tooling.",
    requiredDeliverables: "Production-Style AI Knowledge + Workflow Assistant with deployment guide, security controls, evaluation, and complete portfolio documentation.",
    successCondition: "The flagship proves you can design, build, evaluate, deploy, monitor, and maintain a serious AI system."
  }
];

const weeks = [
  [1, 1, 1, "Python Fundamentals", "variables, strings, numbers, lists, dictionaries, sets, if/else, loops, functions, basic errors", "calculator, unit converter, password generator, text cleaner, grade calculator", "01-python-foundations/week-01-python-basics/"],
  [2, 1, 1, "Files, JSON, CSV and Environments", "reading/writing files, CSV, JSON, folders, modules, requirements.txt, virtual environments, error handling", "CSV cleaner, JSON contact book, file organizer, notes saver, simple report generator", "03-apis-json-csv/week-02-files-json-csv/"],
  [3, 1, 1, "APIs and HTTP", "GET, POST, headers, API keys, status codes, JSON responses, rate limits, retries, environment variables", "weather API app, currency converter, news fetcher, GitHub profile fetcher, API data saver", "03-apis-json-csv/week-03-api-projects/"],
  [4, 1, 1, "Python Final Project + Testing", "project structure, JSON or SQLite storage, logging, pytest, README, clone-and-run usability", "Personal Productivity CLI with tasks, priorities, deadlines, search, export weekly report, logging, tests and README", "01-python-foundations/final-productivity-cli/"],
  [5, 2, 2, "pandas and Data Cleaning", "NumPy arrays, pandas DataFrames, CSVs, missing values, filtering, sorting, grouping, merging, exporting data", "Student Performance Analysis", "04-data-analysis-sql/week-05-student-performance-analysis/"],
  [6, 2, 2, "SQL and Visualization", "SELECT, WHERE, GROUP BY, ORDER BY, JOIN, SQLite with Python, bar/line/histogram/scatter charts", "Sales Dashboard Notebook", "04-data-analysis-sql/week-06-sales-dashboard-sql/"],
  [7, 2, 2, "Machine Learning Fundamentals", "features, labels, train/test split, regression, classification, overfitting, underfitting, accuracy, precision, recall, F1, RMSE, MAE", "House Price Prediction with Linear Regression, Random Forest, saved model and limitations", "05-machine-learning-basics/week-07-house-price-prediction/"],
  [8, 2, 2, "ML App and FastAPI Introduction", "model serving, Streamlit UI, FastAPI /predict endpoint, input validation, model evaluation", "Student Score Predictor", "05-machine-learning-basics/final-ml-prediction-app/"],
  [9, 3, 3, "PyTorch Basics", "tensors, autograd, datasets, dataloaders, nn.Module, loss functions, optimizers, training loop, saving model", "MNIST Digit Classifier", "06-deep-learning-pytorch/week-09-mnist-classifier/"],
  [10, 3, 3, "Computer Vision", "image datasets, pretrained vision models, transfer learning, product classification, evaluation", "Clothing Image Classifier", "06-deep-learning-pytorch/week-10-clothing-image-classifier/"],
  [11, 3, 3, "NLP Basics", "text cleaning, tokenization, embeddings, bag of words, TF-IDF, sentiment analysis, text classification, transformer idea", "Review Sentiment Classifier", "07-huggingface-transformers/week-11-sentiment-classifier/"],
  [12, 3, 3, "Hugging Face Transformers", "pipelines, tokenizers, model loading, summarization, question answering, embeddings, model cards, limitations", "AI Text Summarizer", "07-huggingface-transformers/week-12-text-summarizer/"],
  [13, 4, 4, "LLM Application Basics", "system prompts, user prompts, context windows, temperature, structured output, JSON output, errors, logs", "Simple LLM Chat Application", "08-llm-apps/week-13-simple-llm-chat/"],
  [14, 4, 4, "Local AI", "Ollama, Open WebUI, local model limits, model selection, local vs cloud tradeoffs", "Local AI Assistant using Ollama", "14-local-ai-ollama-openwebui/week-14-local-ai-assistant/"],
  [15, 4, 4, "Prompt Engineering", "prompt templates, constraints, examples, structured output, prompt testing, hallucination control", "AI Business Document Assistant", "08-llm-apps/week-15-business-document-assistant/"],
  [16, 4, 4, "Memory and Backend Storage", "chat history, SQLite persistence, short-term memory, long-term memory, retrieval basics", "Personal Study Assistant with Memory", "08-llm-apps/week-16-study-assistant-memory/"],
  [17, 5, 5, "Embeddings and Vector Search", "embedding models, similarity search, metadata, vector stores, chunking, source info", "Semantic Search over Notes", "09-rag-systems/week-17-semantic-search-notes/"],
  [18, 5, 5, "Basic PDF RAG", "PDF parsing, chunk retrieval, answer grounding, answer-not-found behavior", "PDF Q&A Bot", "09-rag-systems/week-18-pdf-rag-bot/"],
  [19, 5, 5, "Better RAG", "citations, page references, query handling, failure responses, source-backed answer formatting", "PDF Q&A Bot version 2 with citations and page references", "09-rag-systems/week-19-pdf-rag-citations/"],
  [20, 5, 5, "Business RAG System", "business knowledge bases, multi-document support, source trust, usable UI, source-backed answers", "Company Knowledge Assistant", "09-rag-systems/week-20-company-knowledge-assistant/"],
  [21, 6, 6, "Controlled AI Agents", "tool calling, planning, state, memory, retries, stopping conditions, logs, failure modes, when not to use agents", "Research Assistant Agent", "10-ai-agents/week-21-research-assistant-agent/"],
  [22, 6, 6, "n8n AI Automation", "workflow triggers, AI nodes, structured output, Gmail/Sheets/Slack/Telegram integrations, human approval, error branches", "AI Email Reply Assistant with human approval", "11-n8n-automation/week-22-ai-email-approval-workflow/"],
  [23, 6, 6, "FastAPI for AI Applications", "GET /health, POST /upload, POST /ask, GET /documents, GET /history, DELETE /documents/{id}, validation, logs", "RAG API Backend", "12-fastapi-backends/week-23-rag-api-backend/"],
  [24, 6, 6, "Docker and Deployment", "Dockerfile, Docker Compose, environment variables, secrets, deployment checks, GitHub Actions basics", "Dockerized AI Application", "13-docker-deployment/week-24-dockerized-ai-application/"]
];

const projects = [
  "Python Productivity CLI",
  "Business Data Analysis Dashboard",
  "ML Prediction App",
  "Local AI Assistant",
  "LLM Structured Output App",
  "PDF Q&A RAG Chatbot",
  "Company Knowledge Assistant",
  "AI Email Workflow Automation",
  "Dockerized FastAPI RAG Backend",
  "AI Lead Research and Outreach Assistant",
  "Advanced RAG Evaluation System",
  "Flagship AI Knowledge and Workflow Assistant"
];

const skills = [
  ["Python", "Programming", "Deep"],
  ["Git and GitHub", "Engineering Workflow", "Deep"],
  ["Linux and command line", "Engineering Workflow", "Working Knowledge"],
  ["virtual environments", "Engineering Workflow", "Working Knowledge"],
  ["clean code", "Engineering Workflow", "Working Knowledge"],
  ["debugging", "Engineering Workflow", "Deep"],
  ["logging", "Engineering Workflow", "Working Knowledge"],
  ["pytest", "Testing", "Working Knowledge"],
  ["HTTP and REST APIs", "Backend", "Working Knowledge"],
  ["FastAPI", "Backend", "Deep"],
  ["Pydantic", "Backend", "Working Knowledge"],
  ["pandas", "Data", "Working Knowledge"],
  ["NumPy", "Data", "Working Knowledge"],
  ["SQL", "Data", "Working Knowledge"],
  ["SQLite", "Data", "Working Knowledge"],
  ["PostgreSQL", "Data", "Working Knowledge"],
  ["machine learning", "ML", "Working Knowledge"],
  ["scikit-learn", "ML", "Working Knowledge"],
  ["PyTorch", "Deep Learning", "Working Knowledge"],
  ["Hugging Face", "Deep Learning", "Working Knowledge"],
  ["transformers", "Deep Learning", "Working Knowledge"],
  ["LLM application engineering", "LLM", "Deep"],
  ["prompting", "LLM", "Working Knowledge"],
  ["structured outputs", "LLM", "Working Knowledge"],
  ["tool calling", "LLM", "Working Knowledge"],
  ["embeddings", "RAG", "Deep"],
  ["vector search", "RAG", "Deep"],
  ["RAG", "RAG", "Deep"],
  ["reranking", "RAG", "Working Knowledge"],
  ["query rewriting", "RAG", "Working Knowledge"],
  ["evaluation", "RAG", "Deep"],
  ["LangGraph", "Agents", "Working Knowledge"],
  ["AI agents", "Agents", "Working Knowledge"],
  ["n8n", "Automation", "Working Knowledge"],
  ["webhooks", "Automation", "Working Knowledge"],
  ["Docker", "Deployment", "Working Knowledge"],
  ["Docker Compose", "Deployment", "Working Knowledge"],
  ["GitHub Actions", "Deployment", "Basic"],
  ["security", "Production", "Working Knowledge"],
  ["monitoring", "Production", "Basic"],
  ["deployment", "Production", "Working Knowledge"]
];

const toolGroups: Record<string, string[]> = {
  Core: ["Python 3.11+", "VS Code or Cursor", "Git", "GitHub", "virtual environment", "pytest", "ruff", "black"],
  Backend: ["FastAPI", "Pydantic", "Uvicorn", "Postman or Bruno"],
  Data: ["Jupyter Notebook", "pandas", "NumPy", "SQLite Browser", "PostgreSQL"],
  "Machine Learning": ["scikit-learn", "PyTorch", "Hugging Face", "Google Colab", "Kaggle"],
  "Local AI": ["Ollama", "Open WebUI", "local models", "embedding model"],
  RAG: ["Qdrant", "ChromaDB", "FAISS", "sentence-transformers", "LangChain", "LlamaIndex"],
  Automation: ["n8n", "Gmail integration", "Google Sheets integration", "Slack integration", "Telegram integration", "webhook testing"],
  Deployment: ["Docker", "Docker Compose", "GitHub Actions", "cloud provider", "environment variables", "secrets management"]
};

const rules = [
  "Build every week.",
  "Push to GitHub every week.",
  "Do not watch more than you code.",
  "Do not switch roadmap for 90 days.",
  "Do not compare tools endlessly.",
  "Do not wait until you feel ready.",
  "Every project must have a README.",
  "Every serious project must solve a real problem.",
  "Every AI app must handle errors.",
  "Every portfolio project must be explainable.",
  "Every RAG application must show source citations.",
  "Every automation that sends or modifies something requires human approval.",
  "Every deployed AI app must consider security.",
  "Every serious AI system must be evaluated."
];

const resources = [
  ["Official Python Tutorial", "Python", "Python.org", "Documentation"],
  ["freeCodeCamp Python", "Python", "freeCodeCamp", "Course"],
  ["Real Python", "Python", "Real Python", "Tutorial"],
  ["Kaggle Pandas", "Data", "Kaggle", "Course"],
  ["Kaggle Intro to ML", "Machine learning", "Kaggle", "Course"],
  ["pandas documentation", "Data", "pandas", "Documentation"],
  ["SQLite documentation", "SQL", "SQLite", "Documentation"],
  ["SQLite tutorial", "SQL", "SQLite", "Tutorial"],
  ["Google Machine Learning Crash Course", "ML", "Google", "Course"],
  ["scikit-learn documentation", "ML", "scikit-learn", "Documentation"],
  ["PyTorch 60 Minute Blitz", "Deep Learning", "PyTorch", "Tutorial"],
  ["fast.ai Practical Deep Learning", "Deep Learning", "fast.ai", "Course"],
  ["Hugging Face Course", "Transformers", "Hugging Face", "Course"],
  ["Transformers documentation", "Transformers", "Hugging Face", "Documentation"],
  ["sentence-transformers documentation", "RAG", "sentence-transformers", "Documentation"],
  ["Qdrant documentation", "RAG", "Qdrant", "Documentation"],
  ["ChromaDB documentation", "RAG", "ChromaDB", "Documentation"],
  ["FAISS documentation", "RAG", "Meta", "Documentation"],
  ["LangChain RAG documentation", "RAG", "LangChain", "Documentation"],
  ["LlamaIndex documentation", "RAG", "LlamaIndex", "Documentation"],
  ["LangGraph documentation", "Agents", "LangGraph", "Documentation"],
  ["LangChain tool calling", "Agents", "LangChain", "Documentation"],
  ["Hugging Face smolagents", "Agents", "Hugging Face", "Documentation"],
  ["n8n documentation", "Automation", "n8n", "Documentation"],
  ["n8n AI nodes", "Automation", "n8n", "Documentation"],
  ["Postman Learning Center", "Backend", "Postman", "Tutorial"],
  ["FastAPI documentation", "Backend", "FastAPI", "Documentation"],
  ["Docker documentation", "Deployment", "Docker", "Documentation"],
  ["GitHub Actions documentation", "Deployment", "GitHub", "Documentation"]
];

const checkpoints = [
  [1, "Month 1 Foundation Gate", "Python mini projects; API projects; Productivity CLI; GitHub repository; README files", "Do not move to ML until complete."],
  [2, "Month 2 Data and ML Gate", "data analysis notebook; SQL project; ML prediction app; FastAPI endpoint", "Do not move to deep learning until complete."],
  [3, "Month 3 Deep Learning Gate", "PyTorch notebook; image classifier; sentiment classifier; text summarizer", "Do not move to RAG until complete."],
  [4, "Month 4 LLM Application Gate", "LLM chat app; local AI assistant; business document assistant; memory app", "Do not move to advanced agents until complete."],
  [5, "Month 5 RAG Gate", "semantic search; PDF RAG bot; improved RAG with citations; company knowledge assistant", "Stay on RAG until it works."],
  [6, "Month 6 Automation and Deployment Gate", "research agent; n8n workflow; FastAPI RAG backend; Dockerized app", "Do not claim portfolio readiness until complete."],
  [9, "Month 9 Portfolio Gate", "three polished portfolio projects; one real business automation; GitHub profile README; service positioning", "Portfolio must show shipped systems."],
  [12, "Month 12 Flagship Gate", "flagship AI knowledge and workflow assistant; advanced RAG evaluation system; secure API; Docker Compose deployment; complete portfolio", "Flagship must be explainable and deployable."]
];

async function main() {
  await prisma.userSettings.upsert({
    where: { id: "default-settings" },
    update: {},
    create: { id: "default-settings" }
  });

  for (const [index, phaseData] of phases.entries()) {
    await prisma.roadmapPhase.upsert({
      where: { phaseNumber: index },
      update: phaseData,
      create: {
        phaseNumber: index,
        ...phaseData,
        priority: index <= 6 ? "High" : "Medium"
      }
    });
  }

  const phaseByNumber = new Map((await prisma.roadmapPhase.findMany()).map((phase) => [phase.phaseNumber, phase]));

  for (const [weekNumber, month, phaseNumber, focus, topicsToLearn, buildDeliverable, repositoryFolder] of weeks) {
    const phase = phaseByNumber.get(Number(phaseNumber));
    if (!phase) continue;
    await prisma.weeklyPlan.upsert({
      where: { weekNumber: Number(weekNumber) },
      update: {
        month: Number(month),
        phaseId: phase.id,
        focus: String(focus),
        topicsToLearn: String(topicsToLearn),
        buildDeliverable: String(buildDeliverable),
        repositoryFolder: String(repositoryFolder),
        successCondition: "One working output, README, screenshot or sample output, GitHub proof, and weekly review are complete."
      },
      create: {
        weekNumber: Number(weekNumber),
        month: Number(month),
        phaseId: phase.id,
        focus: String(focus),
        topicsToLearn: String(topicsToLearn),
        buildDeliverable: String(buildDeliverable),
        repositoryFolder: String(repositoryFolder),
        targetHours: 12,
        priority: Number(weekNumber) <= 24 ? "High" : "Medium",
        successCondition: "One working output, README, screenshot or sample output, GitHub proof, and weekly review are complete."
      }
    });
  }

  for (const [index, name] of projects.entries()) {
    const phase = phaseByNumber.get(Math.min(index + 1, 12));
    await prisma.project.upsert({
      where: { id: `seed-project-${index + 1}` },
      update: {},
      create: {
        id: `seed-project-${index + 1}`,
        name,
        category: index < 3 ? "Foundation" : index < 6 ? "AI Application" : index < 9 ? "RAG and Automation" : "Portfolio",
        targetMonth: Math.min(Math.floor(index / 2) + 1, 12),
        phaseId: phase?.id,
        problemSolved: "Define the real user problem before implementation.",
        targetUser: "Target user to be specified by the builder.",
        description: `${name} portfolio project tracked from plan to published proof.`,
        technicalStack: "To be finalized during project planning.",
        architecture: "Architecture notes remain blank until designed.",
        repositoryFolder: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      }
    });
  }

  for (const [name, category, requiredDepth] of skills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: {
        name,
        category,
        requiredDepth,
        proofRequired: "Proof must come from a shipped build, project README, test, demo, or evaluation artifact."
      }
    });
  }

  for (const [category, tools] of Object.entries(toolGroups)) {
    for (const toolName of tools) {
      await prisma.environmentTool.upsert({
        where: { id: `tool-${category}-${toolName}` },
        update: {},
        create: {
          id: `tool-${category}-${toolName}`,
          category,
          toolName,
          purpose: `${toolName} supports the ${category} learning environment.`,
          requirementLevel: ["Core", "Backend", "Deployment"].includes(category) ? "Required" : "Recommended",
          verificationCommand: "",
          expectedOutput: "",
          documentationUrl: ""
        }
      });
    }
  }

  for (const [order, text] of rules.entries()) {
    await prisma.rule.upsert({
      where: { order: order + 1 },
      update: {},
      create: { order: order + 1, text }
    });
  }

  for (const [month, title, requiredProof, gateResult] of checkpoints) {
    await prisma.checkpoint.upsert({
      where: { id: `checkpoint-month-${month}` },
      update: {},
      create: {
        id: `checkpoint-month-${month}`,
        month: Number(month),
        title: String(title),
        phaseId: phaseByNumber.get(Number(month))?.id,
        requiredProof: String(requiredProof),
        gateResult: String(gateResult)
      }
    });
  }

  for (const [title, topic, source, type] of resources) {
    await prisma.learningResource.upsert({
      where: { id: `resource-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}` },
      update: {},
      create: {
        id: `resource-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title,
        topic,
        source,
        type,
        notes: "Use this resource only when it directly supports the current build."
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
