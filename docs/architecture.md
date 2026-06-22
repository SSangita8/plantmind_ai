# PlantMind AI Architecture

```text
                User Upload
                    |
              OCR & Parsing
                    |
        +-----------+-----------+
        |                       |
   Vector Store           Knowledge Graph
    ChromaDB                 Neo4j
        |                       |
        +-----------+-----------+
                    |
                AI Agents
        +-----------+-----------+
        |           |           |
    Copilot     RCA Agent  Compliance Agent
        |           |           |
        +-----------+-----------+
                    |
                Dashboard
```

## Hackathon Modules

1. Universal Document Intelligence
2. Industrial Copilot
3. Failure Intelligence Agent

The current frontend is a polished demo. The backend folder is scaffolded for the real FastAPI, ChromaDB, and Gemini/LangChain implementation.
