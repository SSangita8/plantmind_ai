def answer_question(question: str, context: list[dict]) -> dict:
    sources = [
        {
            "source": item.get("source", "Seeded knowledge base"),
            "snippet": item.get("text", ""),
        }
        for item in context
    ]

    return {
        "question": question,
        "answer": (
            "PlantMind AI found relevant maintenance, inspection, SOP, and incident "
            "records. Connect this function to Gemini or OpenAI for generated answers."
        ),
        "confidence": 0.92,
        "sources": sources,
    }
