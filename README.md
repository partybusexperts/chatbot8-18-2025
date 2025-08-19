# Party Bus Quoting Chatbot Monorepo

## Structure

- `/backend` — FastAPI Python backend (CSV quoting API)
- `/apps/chatbot` — Next.js frontend (agent UI)
- `/vehicles.csv` — Vehicle data
- `/project-spec.md` — Full requirements & training

## Quickstart

1. **Backend**
   - `cd backend`
   - `pip install -r requirements.txt`
   - `./run.ps1` (PowerShell)
   - API: http://localhost:8000/quote

2. **Frontend**
   - `cd apps/chatbot`
   - `npm install`
   - `npm run dev`
   - App: http://localhost:3000

## Development
- Edit backend quoting logic in `backend/app.py`
- Edit frontend UI in `apps/chatbot/app/page.tsx`

## Deployment
- Backend: Deploy with Vercel/Render (Python serverless)
- Frontend: Deploy with Vercel (Next.js)

---

See `project-spec.md` for all quoting rules, agent training, and feature roadmap.
