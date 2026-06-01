from fastapi import APIRouter, HTTPException, Query
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()

@router.get("/")
async def get_all_players(year: int = Query(2026)):
    try:
        data = await sheets_service.fetch_hitting(year)
        players = [
            {"name": row["Name"], "team": row["Team"], "nationality": row["Nationality"]}
            for row in data if row.get("Name")
        ]
        return {"status": "success", "players": players}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{name}")
async def get_player(name: str, year: int = Query(2026)):
    try:
        hitting = await sheets_service.fetch_hitting(year)
        pitching = await sheets_service.fetch_pitching(year)
        fielding = await sheets_service.fetch_fielding(year)

        player_hitting = next((r for r in hitting if r.get("Name", "").lower() == name.lower()), None)
        player_pitching = next((r for r in pitching if r.get("Name", "").lower() == name.lower()), None)
        player_fielding = next((r for r in fielding if r.get("Name", "").lower() == name.lower()), None)

        if not player_hitting and not player_pitching:
            raise HTTPException(status_code=404, detail=f"Player '{name}' not found")

        return {
            "status": "success",
            "name": name,
            "year": year,
            "hitting": player_hitting,
            "pitching": player_pitching,
            "fielding": player_fielding,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))