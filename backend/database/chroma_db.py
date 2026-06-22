MEMORY_STORE: list[dict] = [
    {
        "source": "IR-2024-032",
        "text": "Pump P-101 bearing vibration exceeded threshold at 8.7 mm/s and temperature reached 88 C.",
    },
    {
        "source": "WO-2024-118",
        "text": "Pump P-101 drive-end bearing was replaced; grease line was partially blocked.",
    },
    {
        "source": "SOP-MECH-014",
        "text": "Bearing replacement requires lockout tagout, grease-line inspection, shaft alignment, and vibration acceptance checks.",
    },
]


def store_chunks(chunks: list[str], metadata: dict | None = None) -> None:
    metadata = metadata or {}
    for chunk in chunks:
        MEMORY_STORE.append({"text": chunk, "source": metadata.get("source", "upload")})


def query_chunks(query: str, limit: int = 5) -> list[dict]:
    tokens = [token for token in query.lower().replace("-", " ").split() if token]

    def score(item: dict) -> int:
        haystack = f"{item.get('source', '')} {item.get('text', '')}".lower()
        return sum(1 for token in tokens if token in haystack)

    return sorted(MEMORY_STORE, key=score, reverse=True)[:limit]
