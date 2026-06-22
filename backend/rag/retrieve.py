from database.chroma_db import query_chunks


def retrieve_context(question: str) -> list[dict]:
    return query_chunks(question, limit=5)
