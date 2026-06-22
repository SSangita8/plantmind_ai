from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from rag.answer import answer_question
from rag.ingest import ingest_upload
from rag.retrieve import retrieve_context

app = FastAPI(title="PlantMind AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "plantmind-ai"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    result = await ingest_upload(file)
    return result


@app.post("/ask")
async def ask(payload: dict):
    question = payload.get("question", "")
    context = retrieve_context(question)
    return answer_question(question, context)
