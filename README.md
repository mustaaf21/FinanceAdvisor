Here’s a **clean, professional, recruiter-ready README** for your project — you can paste this directly into your `README.md` 👇

---

# 🚀 Finance Advisor — AI-Powered Personal Finance System

A full-stack AI-powered personal finance advisor built with **.NET 8 + React**, featuring a **two-agent architecture** for accurate financial insights and real-time AI-driven recommendations.

---

# 🧠 Key Features

* 📊 Analyze transaction data and spending patterns
* 🤖 AI-powered financial insights using Groq (LLaMA-3)
* ⚙️ Two-agent architecture (deterministic + AI separation)
* 🔐 JWT-based authentication
* 📈 Interactive dashboards with charts
* ☁️ Fully deployed on AWS with CI/CD

---

# 🏗️ Architecture

```
React (Vite)
     ↓
nginx (Docker)
     ↓
ASP.NET Core API (.NET 8)
     ↓
Agent Layer
   ├── Agent 1: RulesEngine + Insights (Deterministic)
   └── Agent 2: AIService (Groq LLM)
     ↓
PostgreSQL (AWS RDS)
```

---

# ⚙️ Tech Stack

| Layer    | Technology                 |
| -------- | -------------------------- |
| Frontend | React (Vite), Tailwind CSS |
| Backend  | ASP.NET Core (.NET 8)      |
| ORM      | Entity Framework Core      |
| Database | PostgreSQL (AWS RDS)       |
| AI       | Groq API (LLaMA-3)         |
| Auth     | JWT Authentication         |
| DevOps   | Docker, GitHub Actions     |
| Hosting  | AWS EC2                    |

---

# 🧱 Project Structure

```
FinanceAdvisor/
├── frontend/                 # React app
├── src/                      # .NET backend (Clean Architecture)
├── docker-compose.yml        # Container orchestration
├── Dockerfile                # Backend Dockerfile
├── .env                      # Environment variables (not committed)
```

---

# 🚀 Deployment

## 🐳 AWS EC2 (Docker + CI/CD)

| Component | Service                   |
| --------- | ------------------------- |
| Frontend  | nginx (Docker)            |
| Backend   | ASP.NET Core API (Docker) |
| Database  | AWS RDS (PostgreSQL)      |
| CI/CD     | GitHub Actions            |
| Hosting   | Amazon EC2                |

---

## ⚙️ Deployment Flow

```
Git Push → GitHub Actions → EC2 → Docker Rebuild → App Live
```

✔ Fully automated deployment pipeline
✔ Zero manual intervention after setup

---

# 🔐 Environment Variables

Stored securely in `.env` (not committed):

```
ConnectionStrings__DefaultConnection=...
GROQ_API_KEY=...
JWT_SECRET=...
ALLOWED_USER_EMAIL=...
```

---

# 🧪 Local Setup

### Prerequisites

* .NET 8 SDK
* Node.js 18+
* PostgreSQL
* Groq API Key

---

### Run Backend

```bash
dotnet run --project src/FinanceAdvisor.API
```

---

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🐳 Docker Setup

```bash
docker-compose up --build
```

Access:

```
http://localhost
```

---

# 🔐 Authentication

* JWT-based authentication
* Token stored in localStorage
* Optional single-user restriction via environment variable

---

# 🤖 AI Design (Key Highlight)

### Two-Agent System

**Agent 1 (Deterministic Engine)**

* Aggregates financial data
* Applies rules and calculations
* Ensures accuracy

**Agent 2 (AI Advisor)**

* Receives structured JSON only
* Generates human-like insights
* Prevents hallucination of numbers

---

# ⚡ CI/CD (GitHub Actions)

Automatically deploys on every push:

```yaml
GitHub → SSH → EC2 → Docker Rebuild
```

---

# 🔒 Security

* Secrets not committed (`.env`)
* HTTPS ready (via Nginx + Certbot)
* JWT authentication
* API routing via reverse proxy

---

# 📌 Future Improvements

* 🔐 HTTPS with custom domain
* 📊 Monitoring (Grafana + Prometheus)
* ⚡ Zero-downtime deployments
* 📈 Advanced analytics dashboards
* 🧠 Multi-user support

---

# 🎯 Why This Project Stands Out

* Clean Architecture with strict separation of concerns
* Real-world AI integration (not just API calls)
* Full DevOps pipeline (Docker + CI/CD)
* Production-ready cloud deployment
* Strong focus on correctness in financial systems

---

# 👨‍💻 Author

**Mustafeez Khan**

* 💼 Full-stack .NET Developer
* 🤖 AI + Backend Systems
* ☁️ Cloud & DevOps Enthusiast

---

# ⭐ If you like this project

Give it a ⭐ — it helps!

---


