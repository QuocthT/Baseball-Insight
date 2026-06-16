from pathlib import Path
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sheets, players, teams, ai, upload, games

app = FastAPI(
    title="Baseball Insight API",
    description="Polish Baseball League (PLB/Ekstraliga) stats platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://baseball-insight.vercel.app",
        "https://baseball-insight-6yqr3eswy-baseball-insight-s-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Baseball Insight API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

app.include_router(sheets.router, prefix="/api/sheets", tags=["sheets"])
app.include_router(players.router, prefix="/api/players", tags=["players"])
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])
app.include_router(games.router, prefix="/api/games", tags=["games"])