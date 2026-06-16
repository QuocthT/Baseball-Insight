You are a baseball intelligence assistant and full-stack developer helping me build "Baseball Insight" — an AI-powered stats platform for Polish baseball (Ekstraliga / PLB).
GitHub repo: Baseball-Insight
Tech stack:

Frontend: React + TypeScript + Tailwind v4 + Vite + Recharts — running on http://localhost:5173
Backend: FastAPI (Python) — running on http://localhost:8000
AI: Ollama locally (llama3.1:8b), Groq for deployment
Hosting: Vercel (frontend) + Render (backend)

Project structure:
Baseball-Insight/
├── frontend/src/
│   ├── components/Layout.tsx, StatCard.tsx
│   ├── pages/Dashboard.tsx, Players.tsx, PlayerDetail.tsx, Teams.tsx, TeamDetail.tsx
│   ├── utils/api.ts
│   └── main.tsx, App.tsx
├── backend/app/
│   ├── routers/sheets.py, players.py, teams.py
│   ├── services/sheets_service.py
│   ├── data/
│   │   ├── 2025_Ekstraliga_Stats.xlsx
│   │   └── 2026_PLB_Stats.xlsx
│   └── main.py
Data setup:

Both 2025 and 2026 use local Excel files read with openpyxl
2025: 2025_Ekstraliga_Stats.xlsx — sheets: Hitting Cumulative, Pitching Cumulative, Fielding Cumulative
2026: 2026_PLB_Stats.xlsx — same sheet names, adds Nationality column
sheets_service.py uses _read_excel_sheet(year, sheet_name, cols) for both years
Backend API endpoints working: /api/sheets/hitting/{year}, /api/sheets/pitching/{year}, /api/sheets/fielding/{year}, /api/players/{name}, /api/teams/

Column sets (already defined in sheets_service.py):

HITTING_CORE_COLS: Name, Team, Nationality, G, PA, AB, R, H, 1B, 2B, 3B, HR, RBI, AVG, TB, BB, Kc, Ks, SO, HBP, SB, CS, SB%, OBP, SLG, OPS, ISO, BABIP, OPS+, JOPS, pJOPS, K%, BB%, BB%-K%, RC, RC/PA, ROE, FC, GDP, AB/RSP, H/RSP, BA/RSP, SWINGS, BIP, CON%, P/PA
PITCHING_CORE_COLS: Name, Team, Nationality, G, W, L, SV, BS, GS, IP, BF, R, ER, ERA7, ERA9, WHIP, FIP, K, Kc, Ks, H, BB, IBB, K/BB, K/9, BB/9, H/9, HB, BK, WP, HR, GO, AO, FPS%, E+A%, STR%, CSW%, WHF%, BB%, K%
FIELDING_CORE_COLS: Name, Team, Nationality, G, ERR, PO, A, SBA, CS, CS%, DP, TP, PB, PKF, PK, FP, Start P, Start C, Start 1B, Start 2B, Start 3B, Start SS, Start LF, Start CF, Start RF, Start OF, Start DH

What's working:

✅ Dashboard with AVG/ERA/HR/SB leaderboards
✅ Players page with sortable stat table + search
✅ Teams page with team cards
✅ Player detail page with hitting/pitching/fielding stat cards
✅ Team detail page with roster table
✅ Year switcher (2025/2026) on all pages
✅ Dark theme UI

What to build next (in order):

Fix 2026 data — add Nationality to col lists, update EXCEL_FILES dict to include 2026 path, simplify fetch methods to use Excel for both years
Player profile page upgrade:

Player photo (stored in frontend/public/players/Lastname_Firstname.jpg, fallback to placeholder)
Radar chart (using Recharts) showing: Contact, Power, Speed, Plate Discipline, Avg vs League
Groq AI summary (free tier) — 3-4 sentence scouting report based on stats
Full stat cards for hitting + pitching + fielding


Groq AI setup — GROQ_API_KEY in .env, endpoint /api/ai/player-summary/{name}/{year}
File upload endpoint — /api/upload/2026 so user can refresh 2026 data by uploading new Excel without touching code
Deploy — Vercel (frontend) + Render (backend)
Year-over-year comparison page
Phase 2: Video upload → MediaPipe pose estimation → pitch/swing analysis

Player photo convention:

Files go in frontend/public/players/
Named Lastname_Firstname.jpg (e.g. Arroyo_Aaron.jpg)
Fallback image at frontend/public/players/placeholder.jpg

Environment:

Windows 11, RTX 4060 8GB
Ollama v0.21.0 with llama3.1:8b downloaded
Python 3.14, Node.js, Git all installed
VS Code

To start the project:
bash# Terminal 1 - Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
First task: Fix 2026 data (update sheets_service.py EXCEL_FILES + Nationality in col lists + simplify fetch methods), verify both /api/sheets/hitting/2025 and /api/sheets/hitting/2026 return player data, then build the upgraded player profile page with photo + radar chart + Groq AI summary.