import os
from fastapi import APIRouter, HTTPException
from app.services.sheets_service import SheetsService

router = APIRouter()
sheets_service = SheetsService()


def _fmt(value, decimals: int = 3) -> str:
    if value is None:
        return "N/A"
    try:
        f = float(value)
        return f"{f:.{decimals}f}"
    except (TypeError, ValueError):
        return str(value)


def _pct(value) -> str:
    if value is None:
        return "N/A"
    try:
        f = float(value)
        # stored as decimal (0.20) → display as percentage string
        return f"{f * 100:.1f}%"
    except (TypeError, ValueError):
        return str(value)


@router.get("/player-summary/{name}/{year}")
async def player_summary(name: str, year: int):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured")

    # Find the player row
    try:
        rows = await sheets_service.fetch_hitting(year)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    player = next(
        (r for r in rows if str(r.get("Name", "")).strip().lower() == name.strip().lower()),
        None,
    )
    if player is None:
        raise HTTPException(status_code=404, detail=f"Player '{name}' not found for {year}")

    avg     = _fmt(player.get("AVG"))
    ops     = _fmt(player.get("OPS"))
    obp     = _fmt(player.get("OBP"))
    slg     = _fmt(player.get("SLG"))
    hr      = player.get("HR", "N/A")
    rbi     = player.get("RBI", "N/A")
    sb      = player.get("SB", "N/A")
    pa      = player.get("PA", "N/A")
    iso     = _fmt(player.get("ISO"))
    k_pct   = _pct(player.get("K%"))
    bb_pct  = _pct(player.get("BB%"))

    prompt = (
        f"You are a baseball scout evaluating a player in the Polish Ekstraliga / PLB league "
        f"— the top professional baseball league in Poland. Do not compare to MLB standards. "
        f"Write a 3-4 sentence scouting report for {name} based on their {year} season stats: "
        f"AVG {avg}, OPS {ops}, HR {hr}, RBI {rbi}, SB {sb}, "
        f"K% {k_pct}, BB% {bb_pct}, ISO {iso}, PA {pa}. "
        f"Focus on their offensive profile, plate discipline, and value to a team in this league context."
    )

    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}],
        )
        summary = completion.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service unavailable")

    return {"player": name, "year": year, "summary": summary}
