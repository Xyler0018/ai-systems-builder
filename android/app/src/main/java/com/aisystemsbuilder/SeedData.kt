package com.aisystemsbuilder

object SeedData {
    val phases = listOf(
        RoadmapPhaseEntity("phase-0", 0, "Setup Week", null, null, "Create a serious learning environment and main GitHub repository before starting the 12-month execution plan.", "Python setup, GitHub, Docker hello-world, repository structure, templates, proof discipline.", "Python, VS Code or Cursor, Git, GitHub, Docker, Docker Compose, Postman or Bruno, SQLite Browser, Jupyter, Ollama, Open WebUI, n8n.", "main GitHub repo, README.md, learning-log.md, weekly-review-template.md, project-checklist.md.", "You can create a virtual environment, install packages, run a script, commit to GitHub, run Docker hello-world, and open the repo from another device.", priority = "High"),
        RoadmapPhaseEntity("phase-1", 1, "Python, GitHub, Files, APIs and Testing", 1, 1, "Become comfortable writing useful Python programs and documenting them.", "Python basics, files, JSON, CSV, APIs, HTTP, environment variables, error handling, pytest, logging, README writing.", "Python, Git, GitHub, venv or uv, pytest, requests, JSON/CSV tooling.", "Python mini projects, CSV/JSON tools, API projects, Personal Productivity CLI, README files, tests, GitHub proof.", "Someone else can clone the repo, run the CLI, see example outputs, and verify at least 5 tests pass.", priority = "High"),
        RoadmapPhaseEntity("phase-2", 2, "Data, SQL, Practical ML and Backend Basics", 2, 2, "Learn enough data, SQL, and ML to understand AI systems and prepare real datasets.", "pandas, NumPy, SQLite, SQL queries, visualization, train/test split, model evaluation, scikit-learn, FastAPI intro.", "Jupyter Notebook, pandas, NumPy, SQLite, matplotlib, scikit-learn, joblib, Streamlit, FastAPI.", "Student Performance Analysis, Sales Dashboard Notebook, House Price Prediction, Student Score Predictor with FastAPI endpoint.", "You can analyze a business dataset, train and evaluate a model, save it, expose a basic prediction endpoint, and explain model limitations.", priority = "High"),
        RoadmapPhaseEntity("phase-3", 3, "Deep Learning, NLP and Hugging Face", 3, 3, "Understand neural networks and modern pretrained models enough to use them correctly.", "tensors, datasets, dataloaders, training loops, optimizers, tokenization, embeddings, sentiment analysis, Hugging Face pipelines.", "PyTorch, Hugging Face Transformers, sentence-transformers, Google Colab, Kaggle.", "MNIST Digit Classifier, Clothing Image Classifier, Review Sentiment Classifier, AI Text Summarizer.", "You can explain epochs, batches, loss, optimizer, tokenization, embeddings, and model limitations.", priority = "High"),
        RoadmapPhaseEntity("phase-4", 4, "LLM Apps, Local AI, Prompt Engineering and Memory", 4, 4, "Build practical LLM apps, understand local vs cloud model tradeoffs, and add memory/storage.", "system prompts, context windows, temperature, structured output, tool calling basics, prompt testing, chat history, memory.", "OpenAI or another API model, Ollama, Open WebUI, SQLite, FastAPI or Streamlit, Pydantic.", "Simple LLM Chat App, Local AI Assistant, AI Business Document Assistant, Personal Study Assistant with Memory.", "The LLM app handles errors, logs behavior, stores useful history, and explains local/cloud tradeoffs.", priority = "High"),
        RoadmapPhaseEntity("phase-5", 5, "RAG Systems", 5, 5, "Build reliable retrieval systems with source-backed answers and citation discipline.", "document loading, chunking, metadata, embeddings, vector databases, semantic search, citations, hallucination reduction.", "sentence-transformers, ChromaDB or Qdrant, FAISS, LangChain or LlamaIndex, PDF tooling.", "Semantic Search over Notes, PDF Q&A Bot, PDF Q&A Bot v2, Company Knowledge Assistant.", "The assistant answers from sources, says when the answer is not found, and displays citations.", priority = "High"),
        RoadmapPhaseEntity("phase-6", 6, "AI Agents, n8n, FastAPI and Docker", 6, 6, "Connect controlled agents, workflow automation, API backends, and deployment packaging.", "tool calling, planning, state, retries, stopping conditions, human approval, n8n workflows, FastAPI, Docker.", "LangGraph or similar, n8n, webhooks, FastAPI, Pydantic, Docker, Docker Compose.", "Research Assistant Agent, AI Email Reply Assistant, RAG API Backend, Dockerized AI Application.", "Automation has human approval before sending or modifying anything, and the backend runs in Docker.", priority = "High"),
        RoadmapPhaseEntity("phase-7", 7, "Portfolio Hardening", 7, 7, "Polish working projects into explainable portfolio assets.", "case-study writing, README quality, architecture explanation, testing, demo recording, cleanup.", "GitHub, Markdown, diagrams, screenshots, demo video tooling, project docs.", "Polished portfolio projects with problem statement, target user, architecture, stack, run commands, limitations, improvements.", "A reviewer can understand what each project solves, run it, and see proof of engineering quality."),
        RoadmapPhaseEntity("phase-8", 8, "Real Business Automation System", 8, 8, "Build a real business-facing automation that combines AI, workflow orchestration, storage, and human approval.", "business workflow mapping, n8n, webhooks, structured output, approval flows, notifications, error branches.", "Python, API model, n8n, Google Sheets, FastAPI webhook, Docker, Slack/Telegram/Gmail integrations.", "AI Lead Research and Outreach Assistant or equivalent real workflow automation.", "The tool solves a real workflow problem and can be demoed end-to-end."),
        RoadmapPhaseEntity("phase-9", 9, "Specialization and Service Packaging", 9, 9, "Package your specialization as a RAG + AI Automation Systems Specialist.", "service positioning, case studies, demo videos, architecture diagrams, before/after workflow explanation.", "GitHub profile README, portfolio homepage, case-study pages, demo videos.", "Portfolio homepage or GitHub profile README, 3 case studies, service descriptions, demo videos, architecture diagrams.", "Your positioning clearly sells working AI systems, not generic AI learning or prompt tinkering."),
        RoadmapPhaseEntity("phase-10", 10, "Advanced RAG and Evaluation", 10, 10, "Become deeper in RAG quality by evaluating retrieval, citations, hallucinations, and failure modes.", "hybrid search, metadata filtering, reranking, query rewriting, evaluation datasets, retrieval accuracy, citation correctness.", "Vector database, rerankers, evaluation scripts, OCR/table extraction tools, LangChain or LlamaIndex.", "Advanced RAG Evaluation System with test questions, expected answers, retrieved chunks, generated answers, scores, failure analysis.", "You can debug why RAG gives bad answers and improve retrieval instead of randomly changing prompts."),
        RoadmapPhaseEntity("phase-11", 11, "Fine-Tuning and MLOps Basics", 11, 11, "Understand model adaptation practically without becoming obsessed with fine-tuning.", "fine-tuning vs RAG, LoRA, QLoRA, instruction datasets, classification fine-tuning, evaluation, MLflow.", "Google Colab or cloud GPU, small open model, MLflow, experiment tracking artifacts.", "Small Fine-Tuning Experiment and MLflow Experiment Tracking Demo.", "You understand when fine-tuning is useful and when RAG or prompting is enough."),
        RoadmapPhaseEntity("phase-12", 12, "Production AI Engineering Flagship", 12, 12, "Build the strongest portfolio project: a production-style AI knowledge and workflow assistant.", "frontend, FastAPI backend, database, authentication basics, uploads, RAG, chat history, citations, n8n, logs, evaluation, security, Docker Compose.", "Frontend or Streamlit, FastAPI, database, vector database, embedding model, LLM, n8n, Docker Compose.", "Production-Style AI Knowledge + Workflow Assistant with deployment guide, security controls, evaluation, and portfolio documentation.", "The flagship proves you can design, build, evaluate, deploy, monitor, and maintain a serious AI system.")
    )

    val weeks = listOf(
        week(1, 1, 1, "Python Fundamentals", "variables, strings, numbers, lists, dictionaries, sets, if/else, loops, functions, basic errors", "calculator, unit converter, password generator, text cleaner, grade calculator", "01-python-foundations/week-01-python-basics/"),
        week(2, 1, 1, "Files, JSON, CSV and Environments", "reading/writing files, CSV, JSON, folders, modules, requirements.txt, virtual environments, error handling", "CSV cleaner, JSON contact book, file organizer, notes saver, simple report generator", "03-apis-json-csv/week-02-files-json-csv/"),
        week(3, 1, 1, "APIs and HTTP", "GET, POST, headers, API keys, status codes, JSON responses, rate limits, retries, environment variables", "weather API app, currency converter, news fetcher, GitHub profile fetcher, API data saver", "03-apis-json-csv/week-03-api-projects/"),
        week(4, 1, 1, "Python Final Project + Testing", "project structure, JSON or SQLite storage, logging, pytest, README, clone-and-run usability", "Personal Productivity CLI with tasks, priorities, deadlines, search, export weekly report, logging, tests and README", "01-python-foundations/final-productivity-cli/"),
        week(5, 2, 2, "pandas and Data Cleaning", "NumPy arrays, pandas DataFrames, CSVs, missing values, filtering, sorting, grouping, merging, exporting data", "Student Performance Analysis", "04-data-analysis-sql/week-05-student-performance-analysis/"),
        week(6, 2, 2, "SQL and Visualization", "SELECT, WHERE, GROUP BY, ORDER BY, JOIN, SQLite with Python, bar/line/histogram/scatter charts", "Sales Dashboard Notebook", "04-data-analysis-sql/week-06-sales-dashboard-sql/"),
        week(7, 2, 2, "Machine Learning Fundamentals", "features, labels, train/test split, regression, classification, overfitting, evaluation metrics", "House Price Prediction", "05-machine-learning-basics/week-07-house-price-prediction/"),
        week(8, 2, 2, "ML App and FastAPI Introduction", "model serving, Streamlit UI, FastAPI /predict endpoint, input validation, model evaluation", "Student Score Predictor", "05-machine-learning-basics/final-ml-prediction-app/"),
        week(9, 3, 3, "PyTorch Basics", "tensors, autograd, datasets, dataloaders, nn.Module, loss functions, optimizers, training loop, saving model", "MNIST Digit Classifier", "06-deep-learning-pytorch/week-09-mnist-classifier/"),
        week(10, 3, 3, "Computer Vision", "image datasets, pretrained vision models, transfer learning, product classification, evaluation", "Clothing Image Classifier", "06-deep-learning-pytorch/week-10-clothing-image-classifier/"),
        week(11, 3, 3, "NLP Basics", "text cleaning, tokenization, embeddings, bag of words, TF-IDF, sentiment analysis, text classification", "Review Sentiment Classifier", "07-huggingface-transformers/week-11-sentiment-classifier/"),
        week(12, 3, 3, "Hugging Face Transformers", "pipelines, tokenizers, model loading, summarization, question answering, embeddings, model cards", "AI Text Summarizer", "07-huggingface-transformers/week-12-text-summarizer/"),
        week(13, 4, 4, "LLM Application Basics", "system prompts, user prompts, context windows, temperature, structured output, JSON output, errors, logs", "Simple LLM Chat Application", "08-llm-apps/week-13-simple-llm-chat/"),
        week(14, 4, 4, "Local AI", "Ollama, Open WebUI, local model limits, model selection, local vs cloud tradeoffs", "Local AI Assistant using Ollama", "14-local-ai-ollama-openwebui/week-14-local-ai-assistant/"),
        week(15, 4, 4, "Prompt Engineering", "prompt templates, constraints, examples, structured output, prompt testing, hallucination control", "AI Business Document Assistant", "08-llm-apps/week-15-business-document-assistant/"),
        week(16, 4, 4, "Memory and Backend Storage", "chat history, SQLite persistence, short-term memory, long-term memory, retrieval basics", "Personal Study Assistant with Memory", "08-llm-apps/week-16-study-assistant-memory/"),
        week(17, 5, 5, "Embeddings and Vector Search", "embedding models, similarity search, metadata, vector stores, chunking, source info", "Semantic Search over Notes", "09-rag-systems/week-17-semantic-search-notes/"),
        week(18, 5, 5, "Basic PDF RAG", "PDF parsing, chunk retrieval, answer grounding, answer-not-found behavior", "PDF Q&A Bot", "09-rag-systems/week-18-pdf-rag-bot/"),
        week(19, 5, 5, "Better RAG", "citations, page references, query handling, failure responses, source-backed answer formatting", "PDF Q&A Bot version 2", "09-rag-systems/week-19-pdf-rag-citations/"),
        week(20, 5, 5, "Business RAG System", "business knowledge bases, multi-document support, source trust, usable UI, source-backed answers", "Company Knowledge Assistant", "09-rag-systems/week-20-company-knowledge-assistant/"),
        week(21, 6, 6, "Controlled AI Agents", "tool calling, planning, state, memory, retries, stopping conditions, logs, failure modes", "Research Assistant Agent", "10-ai-agents/week-21-research-assistant-agent/"),
        week(22, 6, 6, "n8n AI Automation", "workflow triggers, AI nodes, structured output, integrations, human approval, error branches", "AI Email Reply Assistant with human approval", "11-n8n-automation/week-22-ai-email-approval-workflow/"),
        week(23, 6, 6, "FastAPI for AI Applications", "health checks, upload, ask, documents, history, validation, logs", "RAG API Backend", "12-fastapi-backends/week-23-rag-api-backend/"),
        week(24, 6, 6, "Docker and Deployment", "Dockerfile, Docker Compose, environment variables, secrets, deployment checks, GitHub Actions basics", "Dockerized AI Application", "13-docker-deployment/week-24-dockerized-ai-application/")
    )

    val projects = listOf(
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
    ).mapIndexed { index, name ->
        ProjectEntity(
            id = "seed-project-${index + 1}",
            name = name,
            category = when {
                index < 3 -> "Foundation"
                index < 6 -> "AI Application"
                index < 9 -> "RAG and Automation"
                else -> "Portfolio"
            },
            targetMonth = minOf(index / 2 + 1, 12),
            phaseId = "phase-${minOf(index + 1, 12)}",
            problemSolved = "Define the real user problem before implementation.",
            targetUser = "Target user to be specified by the builder.",
            description = "$name portfolio project tracked from plan to published proof.",
            technicalStack = "To be finalized during project planning.",
            repositoryFolder = name.lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-')
        )
    }

    val skills = listOf(
        skill("Python", "Programming", "Deep"),
        skill("Git and GitHub", "Engineering Workflow", "Deep"),
        skill("debugging", "Engineering Workflow", "Deep"),
        skill("pytest", "Testing", "Working Knowledge"),
        skill("HTTP and REST APIs", "Backend", "Working Knowledge"),
        skill("FastAPI", "Backend", "Deep"),
        skill("pandas", "Data", "Working Knowledge"),
        skill("SQL", "Data", "Working Knowledge"),
        skill("machine learning", "ML", "Working Knowledge"),
        skill("PyTorch", "Deep Learning", "Working Knowledge"),
        skill("Hugging Face", "Deep Learning", "Working Knowledge"),
        skill("LLM application engineering", "LLM", "Deep"),
        skill("prompting", "LLM", "Working Knowledge"),
        skill("embeddings", "RAG", "Deep"),
        skill("vector search", "RAG", "Deep"),
        skill("RAG", "RAG", "Deep"),
        skill("evaluation", "RAG", "Deep"),
        skill("AI agents", "Agents", "Working Knowledge"),
        skill("n8n", "Automation", "Working Knowledge"),
        skill("Docker", "Deployment", "Working Knowledge"),
        skill("security", "Production", "Working Knowledge")
    )

    val tools = mapOf(
        "Core" to listOf("Python 3.11+", "VS Code or Cursor", "Git", "GitHub", "pytest"),
        "Backend" to listOf("FastAPI", "Pydantic", "Uvicorn", "Postman or Bruno"),
        "Data" to listOf("Jupyter Notebook", "pandas", "NumPy", "SQLite Browser", "PostgreSQL"),
        "Machine Learning" to listOf("scikit-learn", "PyTorch", "Hugging Face", "Google Colab", "Kaggle"),
        "Local AI" to listOf("Ollama", "Open WebUI", "local models", "embedding model"),
        "RAG" to listOf("Qdrant", "ChromaDB", "FAISS", "sentence-transformers", "LangChain", "LlamaIndex"),
        "Automation" to listOf("n8n", "Gmail integration", "Google Sheets integration", "Slack integration", "webhooks"),
        "Deployment" to listOf("Docker", "Docker Compose", "GitHub Actions", "secrets management")
    ).flatMap { (category, names) ->
        names.map { tool ->
            EnvironmentToolEntity(
                id = "tool-${category.lowercase().replace(" ", "-")}-$tool",
                category = category,
                toolName = tool,
                purpose = "$tool supports the $category learning environment.",
                requirementLevel = if (category in listOf("Core", "Backend", "Deployment")) "Required" else "Recommended"
            )
        }
    }

    val resources = listOf(
        resource("Official Python Tutorial", "Python", "Python.org", "Documentation"),
        resource("Kaggle Pandas", "Data", "Kaggle", "Course"),
        resource("Google Machine Learning Crash Course", "ML", "Google", "Course"),
        resource("PyTorch 60 Minute Blitz", "Deep Learning", "PyTorch", "Tutorial"),
        resource("Hugging Face Course", "Transformers", "Hugging Face", "Course"),
        resource("Qdrant documentation", "RAG", "Qdrant", "Documentation"),
        resource("LangChain RAG documentation", "RAG", "LangChain", "Documentation"),
        resource("LangGraph documentation", "Agents", "LangGraph", "Documentation"),
        resource("n8n documentation", "Automation", "n8n", "Documentation"),
        resource("FastAPI documentation", "Backend", "FastAPI", "Documentation"),
        resource("Docker documentation", "Deployment", "Docker", "Documentation")
    )

    val rules = listOf(
        "Build every week.",
        "Push to GitHub every week.",
        "Do not watch more than you code.",
        "Do not switch roadmap for 90 days.",
        "Every project must have a README.",
        "Every serious project must solve a real problem.",
        "Every AI app must handle errors.",
        "Every RAG application must show source citations.",
        "Every automation that sends or modifies something requires human approval.",
        "Every deployed AI app must consider security.",
        "Every serious AI system must be evaluated."
    ).mapIndexed { index, text -> RuleEntity(id = "rule-${index + 1}", order = index + 1, text = text) }

    val checkpoints = listOf(
        checkpoint(1, "Month 1 Foundation Gate", "Python mini projects; API projects; Productivity CLI; GitHub repository; README files", "Do not move to ML until complete."),
        checkpoint(2, "Month 2 Data and ML Gate", "data analysis notebook; SQL project; ML prediction app; FastAPI endpoint", "Do not move to deep learning until complete."),
        checkpoint(3, "Month 3 Deep Learning Gate", "PyTorch notebook; image classifier; sentiment classifier; text summarizer", "Do not move to RAG until complete."),
        checkpoint(4, "Month 4 LLM Application Gate", "LLM chat app; local AI assistant; business document assistant; memory app", "Do not move to advanced agents until complete."),
        checkpoint(5, "Month 5 RAG Gate", "semantic search; PDF RAG bot; improved RAG with citations; company knowledge assistant", "Stay on RAG until it works."),
        checkpoint(6, "Month 6 Automation and Deployment Gate", "research agent; n8n workflow; FastAPI RAG backend; Dockerized app", "Do not claim portfolio readiness until complete."),
        checkpoint(9, "Month 9 Portfolio Gate", "three polished portfolio projects; one real business automation; GitHub profile README; service positioning", "Portfolio must show shipped systems."),
        checkpoint(12, "Month 12 Flagship Gate", "flagship AI knowledge and workflow assistant; advanced RAG evaluation system; secure API; Docker Compose deployment", "Flagship must be explainable and deployable.")
    )

    private fun week(number: Int, month: Int, phase: Int, focus: String, topics: String, deliverable: String, folder: String) =
        WeeklyPlanEntity(
            id = "week-$number",
            weekNumber = number,
            month = month,
            phaseId = "phase-$phase",
            focus = focus,
            topicsToLearn = topics,
            buildDeliverable = deliverable,
            repositoryFolder = folder,
            priority = if (number <= 24) "High" else "Medium",
            successCondition = "One working output, README, screenshot or sample output, GitHub proof, and weekly review are complete."
        )

    private fun skill(name: String, category: String, depth: String) =
        SkillEntity(
            id = "skill-${name.lowercase().replace(Regex("[^a-z0-9]+"), "-")}",
            name = name,
            category = category,
            requiredDepth = depth,
            proofRequired = "Proof must come from a shipped build, project README, test, demo, or evaluation artifact."
        )

    private fun resource(title: String, topic: String, source: String, type: String) =
        LearningResourceEntity(
            id = "resource-${title.lowercase().replace(Regex("[^a-z0-9]+"), "-")}",
            title = title,
            topic = topic,
            source = source,
            type = type,
            notes = "Use this resource only when it directly supports the current build."
        )

    private fun checkpoint(month: Int, title: String, proof: String, gate: String) =
        CheckpointEntity(
            id = "checkpoint-month-$month",
            month = month,
            title = title,
            phaseId = "phase-$month",
            requiredProof = proof,
            gateResult = gate
        )
}
