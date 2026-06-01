from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sheets, players, teams

app = FastAPI(
    title="Baseball Insight API",
    description="Polish Baseball League (PLB/Ekstraliga) stats platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://baseball-insight.vercel.app"],
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