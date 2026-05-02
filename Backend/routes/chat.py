from fastapi import APIRouter
from pydantic import BaseModel
import requests
import os
from services.embedder import embed_query
from db.vector_store import search_documents

router = APIRouter()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:1b")

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(req: ChatRequest):
    query_embedding = embed_query(req.question)
    relevant_chunks = search_documents(query_embedding, n_results=5)

    if not relevant_chunks:
        return {
            "answer": "No documents found. Please upload a document first.",
            "sources": []
        }

    context = "\n\n".join(relevant_chunks)

    prompt = f"""You are an intelligent document assistant for Tynor company.
Use ONLY the context below to answer the question.
If the answer is not in the context, say "I could not find this information in the uploaded documents."

Context:
{context}

Question: {req.question}

Answer clearly and concisely:"""

    response = requests.post(OLLAMA_URL, json={
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    })
    response.raise_for_status()
    answer = response.json().get("response", "")

    return {
        "answer": answer,
        "sources": relevant_chunks[:2]
    }