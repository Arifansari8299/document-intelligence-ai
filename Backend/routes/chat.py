from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
from services.embedder import embed_query
from db.vector_store import search_documents

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(req: ChatRequest):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return {
        "answer": response.choices[0].message.content, 
        "sources": relevant_chunks[:2]
    }
