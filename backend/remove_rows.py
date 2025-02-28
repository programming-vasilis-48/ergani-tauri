def remove_rows(data, Future_shift=False, Daysoff=False):
    """
    Remove rows from the data (a list of dictionaries) based on the Summary field.
    If Future_shift is True, remove rows whose Summary contains "Future shift".
    If Daysoff is True, remove rows whose Summary contains "Scheduled day off" (or "day off").
    """
    filtered = []
    for row in data:
        summary = row.get("Summary", "").strip().lower()
        remove = False
        if Future_shift and "future shift" in summary:
            remove = True
        if Daysoff and ("scheduled day off" in summary or "day off" in summary):
            remove = True
        if not remove:
            filtered.append(row)
    return filtered