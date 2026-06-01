from fastapi import APIRouter, HTTPException
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()


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
