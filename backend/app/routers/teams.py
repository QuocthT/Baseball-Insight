from fastapi import APIRouter, HTTPException, Query
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()

TEAMS = {
    "KAT": "Silesia Rebels Katowice",
    "RYB": "Rybnik Frogs",
    "WŁA": "Wloclawek",
    "WAR": "Warsaw Eagles",
    "WRO": "Wroclaw Lumberjacks",
    "ŻOR": "Zory",
    "KUT": "Kutnowiak",
    "OSI": "Osielsko",
    "KRA": "Krakow",
    "DRA": "Dragonflies",
}

@router.get("/")
async def get_teams():
    return {"status": "success", "teams": TEAMS}

@router.get("/{team_code}")
async def get_team_roster(team_code: str, year: int = Query(2026)):
    try:
        team_code = team_code.upper()
        if team_code not in TEAMS:
            raise HTTPException(status_code=404, detail=f"Team '{team_code}' not found")

        hitting = await sheets_service.fetch_hitting(year)
        roster = [r for r in hitting if r.get("Team", "").upper() == team_code and int(r.get("G") or 0) > 0]

        return {
            "status": "success",
            "team_code": team_code,
            "team_name": TEAMS[team_code],
            "year": year,
            "roster": roster,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))