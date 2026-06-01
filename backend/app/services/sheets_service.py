import os
from pathlib import Path
from typing import List, Dict, Any
from openpyxl import load_workbook

DATA_DIR = Path(__file__).parent.parent / "data"

EXCEL_FILES = {
    2025: DATA_DIR / "2025_Ekstraliga_Stats.xlsx",
    2026: DATA_DIR / "2026_PLB_Stats.xlsx",
}

HITTING_CORE_COLS = [
    "Name", "Team", "Nationality", "G", "PA", "AB", "R", "H", "1B", "2B", "3B", "HR",
    "RBI", "AVG", "TB", "BB", "Kc", "Ks", "SO", "HBP", "SB", "CS",
    "SB%", "OBP", "SLG", "OPS", "ISO", "BABIP", "OPS+", "JOPS", "pJOPS",
    "K%", "BB%", "BB%-K%", "RC", "RC/PA", "ROE", "FC", "GDP",
    "AB/RSP", "H/RSP", "BA/RSP", "SWINGS", "BIP", "CON%", "P/PA",
]

PITCHING_CORE_COLS = [
    "Name", "Team", "Nationality", "G", "W", "L", "SV", "BS", "GS", "IP", "BF",
    "R", "ER", "ERA7", "ERA9", "WHIP", "FIP", "K", "Kc", "Ks",
    "H", "BB", "IBB", "K/BB", "K/9", "BB/9", "H/9", "HB", "BK",
    "WP", "HR", "GO", "AO", "FPS%", "E+A%", "STR%", "CSW%", "WHF%",
    "BB%", "K%",
]

FIELDING_CORE_COLS = [
    "Name", "Team", "Nationality", "G", "ERR", "PO", "A", "SBA", "CS", "CS%",
    "DP", "TP", "PB", "PKF", "PK", "FP",
    "Start P", "Start C", "Start 1B", "Start 2B", "Start 3B",
    "Start SS", "Start LF", "Start CF", "Start RF", "Start OF", "Start DH",
]


class SheetsService:

    def _read_excel_sheet(self, year: int, sheet_name: str, core_cols: List[str]) -> List[Dict[str, Any]]:
        path = EXCEL_FILES.get(year)
        if not path or not path.exists():
            raise FileNotFoundError(f"Excel file not found for year {year}: {path}")

        wb = load_workbook(path, read_only=True, data_only=True)
        ws = wb[sheet_name]

        rows = ws.iter_rows(values_only=True)
        headers = [str(h).strip() if h else "" for h in next(rows)]

        result = []
        for row in rows:
            if not row[0]:
                continue
            row_dict = dict(zip(headers, row))
            name = str(row_dict.get("Name", "")).strip()
            if not name or name == "Name":
                continue

            cleaned = {}
            for col in core_cols:
                val = row_dict.get(col, None)
                if val in ["#DIV/0!", "#VALUE!", "#REF!", "#N/A", "#NAME?", None]:
                    cleaned[col] = None
                elif isinstance(val, float):
                    cleaned[col] = round(val, 3)
                else:
                    cleaned[col] = val
            result.append(cleaned)

        wb.close()
        return result

    async def fetch_hitting(self, year: int) -> List[Dict[str, Any]]:
        return self._read_excel_sheet(year, "Hitting Cumulative", HITTING_CORE_COLS)

    async def fetch_pitching(self, year: int) -> List[Dict[str, Any]]:
        return self._read_excel_sheet(year, "Pitching Cumulative", PITCHING_CORE_COLS)

    async def fetch_fielding(self, year: int) -> List[Dict[str, Any]]:
        return self._read_excel_sheet(year, "Fielding Cumulative", FIELDING_CORE_COLS)

    async def fetch_stats(self, year: int) -> List[Dict[str, Any]]:
        return await self.fetch_hitting(year)
