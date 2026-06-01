# NOTE: Render free tier has ephemeral filesystem.
# Uploaded files are lost on dyno restart.
# For production persistence use S3/R2 and update
# sheets_service to read from there instead.

import shutil
from pathlib import Path
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()

DATA_DIR = Path(__file__).parent.parent / "data"
TARGET_PATH = DATA_DIR / "2026_PLB_Stats.xlsx"


@router.post("/2026")
async def upload_2026(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx files are accepted")

    try:
        with TARGET_PATH.open("wb") as out:
            shutil.copyfileobj(file.file, out)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Upload failed", "detail": str(e)})
    finally:
        await file.close()

    try:
        rows = await sheets_service.fetch_hitting(2026)
        if len(rows) == 0:
            raise ValueError("Hitting sheet returned 0 rows after upload")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Upload failed", "detail": str(e)})

    return {"status": "ok", "message": "2026 data updated", "rows": len(rows)}
