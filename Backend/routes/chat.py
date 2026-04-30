from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
import os
from services.embedder import embed_query
from db.vector_store import search_documents

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(req: ChatRequest):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    query_embedding = embed_query(req.question)
    relevant_chunks = search_documents(query_embedding, n_results=5)
    context = "\n\n".join(relevant_chunks)

    prompt = f"""You are an intelligent document assistant for Tynor company.
Use ONLY the context below to answer the question.
If the answer is not in the context, say "I could not find this information in the uploaded documents."

Context:
{context}

Question: {req.question}

Answer clearly and concisely:"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )
    return {"answer": response.text, "sources": relevant_chunks[:2]}
