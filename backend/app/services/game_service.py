import os
import re
import csv
import xlrd
from pathlib import Path
from typing import List, Dict, Any, Optional

PLB_DIR = Path(__file__).parent.parent / "data" / "2026 PLB"

REQUIRED_CSVS = {
    "statsHomeBatting.csv",
    "statsVisitorBatting.csv",
    "statsHomePitching.csv",
    "statsVisitorPitching.csv",
    "statsHomeFielding.csv",
    "statsVisitorFielding.csv",
}


def _find_game_dirs() -> List[Dict]:
    """Walk 2026 PLB and find all dirs containing the 6 standard stats CSVs."""
    if not PLB_DIR.exists():
        return []
    results = []
    seen_game_ids = set()
    for root, dirs, files in os.walk(PLB_DIR):
        if not REQUIRED_CSVS.issubset(set(files)):
            continue
        game_path = Path(root)
        # Find ancestor round folder
        round_folder = None
        for parent in game_path.parents:
            if re.match(r"PLB 202\d Round \d+", parent.name):
                round_folder = parent
                break
        if round_folder is None:
            continue
        # Game folder = direct child of round folder containing this path
        rel = game_path.relative_to(round_folder)
        game_folder_name = rel.parts[0]
        round_match = re.search(r"Round (\d+)", round_folder.name)
        round_num = int(round_match.group(1)) if round_match else 0
        slug = re.sub(r"[^a-zA-Z0-9._-]", "-", game_folder_name)
        game_id = f"r{round_num}_{slug}"
        if game_id in seen_game_ids:
            continue
        seen_game_ids.add(game_id)
        results.append({
            "game_id": game_id,
            "round": round_folder.name,
            "round_num": round_num,
            "path": game_path,
        })
    results.sort(key=lambda g: (g["round_num"], str(g["path"])))
    return results


def _extract_header(xls_path: Path) -> Dict[str, str]:
    """Pull visitor name, home name, and date from XLS title row."""
    try:
        wb = xlrd.open_workbook(str(xls_path), encoding_override="cp1250")
        ws = wb.sheet_by_index(0)
        if ws.nrows < 2 or ws.ncols < 3:
            return {}
        title = str(ws.cell_value(1, 2)).strip()
        # "Game Stats - 5/31/26 Silesia Rybnik at Barons Wrocław"
        m = re.match(r"Game Stats\s*-\s*([\d/]+)\s+(.+?)\s+at\s+(.+?)\s*$", title)
        if not m:
            return {}
        raw_date, visitor, home = m.group(1), m.group(2).strip(), m.group(3).strip()
        try:
            parts = raw_date.split("/")
            mo, day, yr = int(parts[0]), int(parts[1]), int(parts[2])
            date = f"20{yr:02d}-{mo:02d}-{day:02d}"
        except Exception:
            date = raw_date
        return {"visitor": visitor, "home": home, "date": date}
    except Exception:
        return {}


def _csv_totals(csv_path: Path) -> Dict[str, str]:
    """Return the TOTALS row from a stats CSV as a dict."""
    try:
        with open(csv_path, encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                if row.get("Name", "").strip().upper() == "TOTALS":
                    return dict(row)
    except Exception:
        pass
    return {}


def _csv_players(csv_path: Path) -> List[Dict]:
    """Return all non-TOTALS player rows from a stats CSV."""
    rows = []
    try:
        with open(csv_path, encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                name = row.get("Name", "").strip()
                if name and name.upper() != "TOTALS":
                    rows.append(dict(row))
    except Exception:
        pass
    return rows


def _int(val: Any) -> Optional[int]:
    try:
        return int(float(val))
    except Exception:
        return None


class GameService:
    def list_games(self) -> List[Dict]:
        games = []
        for g in _find_game_dirs():
            p = g["path"]
            hdr = _extract_header(p / "gamestats.xls")
            vb = _csv_totals(p / "statsVisitorBatting.csv")
            hb = _csv_totals(p / "statsHomeBatting.csv")
            vf = _csv_totals(p / "statsVisitorFielding.csv")
            hf = _csv_totals(p / "statsHomeFielding.csv")
            games.append({
                "game_id":   g["game_id"],
                "round":     g["round"],
                "round_num": g["round_num"],
                "date":      hdr.get("date", ""),
                "visitor":   hdr.get("visitor", "Away"),
                "home":      hdr.get("home", "Home"),
                "visitor_r": _int(vb.get("R")),
                "visitor_h": _int(vb.get("H")),
                "visitor_e": _int(vf.get("ERR")),
                "home_r":    _int(hb.get("R")),
                "home_h":    _int(hb.get("H")),
                "home_e":    _int(hf.get("ERR")),
            })
        return games

    def get_game(self, game_id: str) -> Optional[Dict]:
        for g in _find_game_dirs():
            if g["game_id"] != game_id:
                continue
            p = g["path"]
            hdr = _extract_header(p / "gamestats.xls")
            vb_tot = _csv_totals(p / "statsVisitorBatting.csv")
            hb_tot = _csv_totals(p / "statsHomeBatting.csv")
            vf_tot = _csv_totals(p / "statsVisitorFielding.csv")
            hf_tot = _csv_totals(p / "statsHomeFielding.csv")
            return {
                "game_id":   game_id,
                "round":     g["round"],
                "round_num": g["round_num"],
                "date":      hdr.get("date", ""),
                "visitor":   hdr.get("visitor", "Away"),
                "home":      hdr.get("home", "Home"),
                "line_score": {
                    "visitor_r": _int(vb_tot.get("R")),
                    "visitor_h": _int(vb_tot.get("H")),
                    "visitor_e": _int(vf_tot.get("ERR")),
                    "home_r":    _int(hb_tot.get("R")),
                    "home_h":    _int(hb_tot.get("H")),
                    "home_e":    _int(hf_tot.get("ERR")),
                },
                "visitor_batting":  _csv_players(p / "statsVisitorBatting.csv"),
                "home_batting":     _csv_players(p / "statsHomeBatting.csv"),
                "visitor_pitching": _csv_players(p / "statsVisitorPitching.csv"),
                "home_pitching":    _csv_players(p / "statsHomePitching.csv"),
            }
        return None
