# 💰 FinanceAdvisor — AI-Powered Personal Finance System

> A full-stack AI-powered personal finance application built with **.NET 8 + React (Vite)**, featuring a **two-agent architecture** that separates deterministic financial logic from LLM-driven insights — deployed end-to-end on AWS at **zero cost**.

---

## 🌐 Live Deployment

| Component | Service |
|-----------|---------|
| Frontend | React (Vite) + Nginx · Docker on **AWS EC2** |
| Backend | ASP.NET Core (.NET 8) · Docker on **AWS EC2** |
| Database | **Amazon RDS** (PostgreSQL) |
| AI Engine | **Groq API** (LLaMA-3) |
| CI/CD | **GitHub Actions** → SSH → EC2 → Docker Rebuild |

> ✅ Fully automated deployment — every `git push` to `main` triggers a rebuild and goes live.

---

## 🧠 What It Does

- 📊 Ingests and categorises transaction data
- 🔍 Detects spending patterns using a deterministic rules engine
- 🤖 Generates human-readable financial insights via Groq LLaMA-3
- 📈 Displays interactive dashboards with charts
- 🔐 Protects all routes via JWT authentication

---

## 🏗️ Architecture

```
React (Vite)
     │
  nginx (Docker)
     │
ASP.NET Core API (.NET 8)
     │
  ┌──┴──────────────────────────┐
  │           Agent Layer        │
  │  Agent 1 — Rules Engine      │  ← Deterministic: aggregates data, applies rules
  │  Agent 2 — AI Advisor (Groq) │  ← Receives structured JSON, generates insights
  └──────────────────────────────┘
     │
PostgreSQL (Amazon RDS)
```

### Why Two Agents?

Most AI finance apps pass raw user data directly to an LLM — which leads to hallucinated numbers. This system separates concerns:

- **Agent 1** handles all arithmetic, aggregation, and rule logic deterministically.
- **Agent 2** receives only pre-validated, structured JSON. It never touches raw data or performs calculations — it only interprets and explains.

This guarantees **accuracy in financial figures** while still producing natural-language insights.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | ASP.NET Core (.NET 8), C# |
| ORM | Entity Framework Core |
| Database | PostgreSQL (Amazon RDS — Free Tier) |
| AI | Groq API (LLaMA-3) |
| Auth | JWT Bearer Authentication |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Amazon EC2 (Free Tier) |
| Secrets | `.env` file on EC2 (not committed) |

---

## 📁 Project Structure

```
FinanceAdvisor/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── frontend/                   # React + Vite app
│   ├── src/
│   └── Dockerfile              # Nginx-based production build
├── src/                        # .NET 8 backend (Clean Architecture)
│   ├── FinanceAdvisor.API/     # Controllers, Middleware, DI
│   ├── FinanceAdvisor.Application/  # Services, Agent logic
│   ├── FinanceAdvisor.Domain/  # Entities, Interfaces
│   └── FinanceAdvisor.Infrastructure/  # EF Core, Groq client, Repos
├── docker-compose.yml          # Orchestrates backend + frontend
├── Dockerfile                  # Backend multi-stage build
├── FinanceAdvisor.sln
├── setup.sh                    # Linux setup script
├── setup.bat                   # Windows setup script
└── .env                        # Secrets (on EC2 only — never committed)
```

---

## 🚀 CI/CD Pipeline

```
git push → GitHub Actions → SSH into EC2 → git pull → docker-compose up --build
```

- **Zero manual steps** after initial EC2 setup
- Secrets managed via `.env` file on the EC2 instance (not in GitHub)
- GitHub Actions uses SSH key stored as a repository secret

---

## 🔐 Environment Variables

Stored in a `.env` file on the EC2 instance. **Never committed to source control.**

```env
ConnectionStrings__DefaultConnection=Host=<rds-endpoint>;Database=financeadvisor;Username=...;Password=...
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
ALLOWED_USER_EMAIL=your@email.com
```

The `docker-compose.yml` loads this file automatically:

```yaml
env_file:
  - .env
```

---

## 💻 Local Development Setup

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- PostgreSQL (local or Docker)
- [Groq API Key](https://console.groq.com) (free)

### Run the Backend

```bash
# Set environment variables (local)
export GROQ_API_KEY=your_key
export JWT_SECRET=your_secret
export ConnectionStrings__DefaultConnection="Host=localhost;..."

dotnet run --project src/FinanceAdvisor.API
# API available at: http://localhost:5000
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
# App available at: http://localhost:5173
```

---

## 🐳 Docker (Full Stack)

```bash
# Create .env file first (see Environment Variables section)
docker-compose up --build
```

Access the app at `http://localhost`.

---

## 🔐 Authentication

- JWT Bearer tokens issued on login
- Token stored in `localStorage` on the client
- All API endpoints are protected via `[Authorize]`
- Optional single-user restriction via `ALLOWED_USER_EMAIL` env var

---

## 🤖 AI Integration Detail

The Groq LLaMA-3 model is called by **Agent 2** only after Agent 1 has:

1. Aggregated all transactions by category and time period
2. Computed totals, averages, and deltas deterministically
3. Serialised the result as structured JSON

The LLM prompt explicitly instructs the model not to perform any arithmetic — it only interprets the pre-computed data. This design pattern prevents the most common failure mode in AI finance tools: **hallucinated numbers**.

---

## ☁️ AWS Free Tier Cost Breakdown

| Service | Tier Used | Monthly Cost |
|---------|-----------|-------------|
| EC2 (t2.micro) | Free Tier (750 hrs/mo) | $0 |
| RDS PostgreSQL (db.t3.micro) | Free Tier (750 hrs/mo) | $0 |
| Groq API | Free Plan | $0 |
| GitHub Actions | Free Plan (2000 min/mo) | $0 |
| **Total** | | **$0** |


---

> ⭐ If this project helped you or you found it interesting, drop a star — it's appreciated!
