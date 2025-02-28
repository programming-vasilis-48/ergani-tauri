from openpyxl import Workbook
from datetime import datetime
from typing import List, Dict

def parse_iso_datetime(value):
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None

def get_hours_diff_iso(start_str, finish_str) -> float:
    if not start_str or not finish_str:
        return 0.0
    start_dt = parse_iso_datetime(start_str)
    finish_dt = parse_iso_datetime(finish_str)
    if not start_dt or not finish_dt:
        return 0.0
    hours = (finish_dt - start_dt).total_seconds() / 3600.0
    return hours + 24.0 if hours < 0 else hours

def summary_and_save(data: List[Dict], filename) -> Dict:
    stats = {}
    for row in data:
        afm = str(row.get("AFM", "")).strip()
        if not afm:
            continue
        # Get time strings (or empty if missing)
        ps = row.get("Planned Start (ISO)", "")
        pe = row.get("Planned End (ISO)", "")
        as_ = row.get("Actual Start (ISO)", "")
        ae = row.get("Actual End (ISO)", "")
        if afm not in stats:
            stats[afm] = {"planned_hours": 0.0, "actual_hours": 0.0,
                          "missed_days": 0, "forgot_in_out_days": 0}
        stats[afm]["planned_hours"] += get_hours_diff_iso(ps, pe)
        stats[afm]["actual_hours"] += get_hours_diff_iso(as_, ae)
        if not as_ and not ae:
            stats[afm]["missed_days"] += 1
        elif (not as_ and ae) or (as_ and not ae):
            stats[afm]["forgot_in_out_days"] += 1

    for afm, v in stats.items():
        v["difference_hours"] = v["actual_hours"] - v["planned_hours"]

    # Save to Excel
    wb = Workbook()
    ws = wb.active
    ws.title = "Summary"
    ws.append(["AFM", "PLANNED_HOURS", "ACTUAL_HOURS", "DIFFERENCE_HOURS",
               "MISSED_DAYS", "FORGOT_TO_CLOCK_IN_OUT"])
    for afm, v in stats.items():
        ws.append([afm,
                   round(v["planned_hours"], 2),
                   round(v["actual_hours"], 2),
                   round(v["difference_hours"], 2),
                   v["missed_days"],
                   v["forgot_in_out_days"]])
    wb.save(filename)
    print(f"Summary created: '{filename}'")
    return stats
