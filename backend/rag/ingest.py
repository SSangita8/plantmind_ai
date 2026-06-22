from pathlib import Path
from shutil import copyfileobj

from database.chroma_db import store_chunks

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def chunk_text(text: str, chunk_size: int = 900, overlap: int = 150) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = max(end - overlap, end)
    return [chunk.strip() for chunk in chunks if chunk.strip()]


async def ingest_upload(file):
    path = UPLOAD_DIR / file.filename
    with path.open("wb") as buffer:
        copyfileobj(file.file, buffer)

    # Hackathon starter: replace this with PyMuPDF/pdfplumber/OCR extraction.
    extracted_text = (
        f"Uploaded industrial document {file.filename}. "
        "Extraction pipeline: OCR, entity extraction, vector database, knowledge graph."
    )
    chunks = chunk_text(extracted_text)
    store_chunks(chunks, metadata={"source": file.filename})

    return {
        "status": "indexed",
        "file": file.filename,
        "chunks": len(chunks),
        "pipeline": ["upload", "ocr", "entity_extraction", "vector_db", "knowledge_graph"],
    }
