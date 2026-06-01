from fastapi import APIRouter, HTTPException
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()

@router.get("/sync/{year}")
async def sync_stats(year: int):
    """Sync stats from Google Sheets for a given year"""
    if year not in [2025, 2026]:
        raise HTTPException(status_code=400, detail="Year must be 2025 or 2026")
    try:
        data = await sheets_service.fetch_stats(year)
        return {"status": "success", "year": year, "rows": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hitting/{year}")
async def get_hitting_stats(year: int):
    try:
        data = await sheets_service.fetch_hitting(year)
        return {"status": "success", "year": year, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pitching/{year}")
async def get_pitching_stats(year: int):
    try:
        data = await sheets_service.fetch_pitching(year)
        return {"status": "success", "year": year, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fielding/{year}")
async def get_fielding_stats(year: int):
    try:
        data = await sheets_service.fetch_fielding(year)
        return {"status": "success", "year": year, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/raw/{year}")
async def get_raw(year: int):
    """Debug: see raw CSV data"""
    sheet_id = sheets_service.sheets_service.SHEET_URLS[year] if hasattr(sheets_service, 'sheets_service') else None
    from app.services.sheets_service import SHEET_URLS
    import httpx, io, csv
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_URLS[year]}/gviz/tq?tqx=out:csv&gid=0"
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        response = await client.get(url)
    lines = response.text.strip().split("\n")
    return {
        "first_5_lines": lines[:5],
        "total_lines": len(lines)
    }