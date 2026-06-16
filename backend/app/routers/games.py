from fastapi import APIRouter, HTTPException
from app.services.game_service import GameService

router = APIRouter()
_svc = GameService()


@router.get("/")
def list_games():
    return {"games": _svc.list_games()}


@router.get("/{game_id}")
def get_game(game_id: str):
    game = _svc.get_game(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail=f"Game '{game_id}' not found")
    return game
