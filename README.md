# Jupid AI — Business Intelligence Platform

An AI-powered business intelligence platform focused on three core domains:
**SEO Analysis**, **Marketing Analysis**, and **Sales Analysis** — powered by Google Gemini.

---

## 🏗️ Project Structure

```
Jupid 2/
├── backend/          # FastAPI + Python backend
├── frontend/         # Next.js 15 + Tailwind CSS frontend
├── business_assets/  # Business and competitor details (JSON/Data)
```

---

## 🚀 Getting Started

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Fill in your API keys & DB URL
uvicorn app.main:app --reload
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend at: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables (Backend)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (asyncpg) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SERPAPI_KEY` | SerpAPI key for web scraping |
| `GNEWS_API_KEY` | GNews API key for news analysis |
| `SECRET_KEY` | JWT secret key |
| `FRONTEND_URL` | Frontend URL for CORS |

---

## 🧠 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/seo/analyze` | SEO analysis with Gemini |
| POST | `/api/v1/marketing/analyze` | Marketing campaign analysis |
| POST | `/api/v1/sales/analyze` | Sales performance analysis |
| POST | `/api/v1/chat/` | AI chat with session memory |
| DELETE | `/api/v1/chat/{session_id}` | Clear chat session |
| GET | `/health` | Health check |

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python, SQLAlchemy (async), asyncpg, PostgreSQL
- **AI**: Google Gemini 1.5 Pro
- **Frontend**: Next.js 15, Tailwind CSS, TypeScript
- **Deployment**: Render (backend), Vercel (frontend)
