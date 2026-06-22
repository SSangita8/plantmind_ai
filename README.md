# PlantMind AI

PlantMind AI is a hackathon MVP for the problem statement: **AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain**.

## What It Demonstrates

- Universal document intelligence with seeded industrial documents and upload simulation
- RAG-style industrial copilot with confidence scores and source citations
- Knowledge graph visualization for assets, inspections, work orders, incidents, and SOPs
- Failure intelligence agent that highlights recurring root-cause patterns and recommended actions

## Project Structure

```text
plantmind-ai/
├── frontend/
│   ├── pages/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── components/
│   └── services/
│       └── api.js
│
├── backend/
│   ├── app.py
│   ├── rag/
│   │   ├── ingest.py
│   │   ├── retrieve.py
│   │   └── answer.py
│   ├── database/
│   │   └── chroma_db.py
│   ├── uploads/
│   └── requirements.txt
│
└── docs/
    └── architecture.md
```

## How To Run The Demo

Open `frontend/pages/index.html` directly in a browser. The root `index.html` redirects there. No install step or API key is required for the static demo.

## Backend Starter

The backend folder contains the FastAPI/RAG starter matching the proposed architecture. To turn it into a live backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

## Best Demo Flow

1. Click the upload button to simulate indexing a vendor manual.
2. Ask: `Why did Pump P-101 fail last year?`
3. Ask: `What does the SOP say about bearing replacement?`
4. Switch the knowledge graph asset selector between `Pump P-101`, `Compressor C-204`, and `Plant`.
5. Click `Run RCA` in the Failure Intelligence Agent panel.

## Upgrade Path

- Replace the deterministic copilot with a FastAPI RAG backend.
- Store uploaded document chunks in ChromaDB.
- Use Gemini or OpenAI for generated answers.
- Replace the SVG graph with Neo4j-backed entity relationships.
