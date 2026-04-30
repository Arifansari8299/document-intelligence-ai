from langchain_text_splitters import RecursiveCharacterTextSplitter
from google import genai
import os

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def embed_texts(texts: list[str]) -> list[list[float]]:
    client = get_client()
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=texts
    )
    return [e.values for e in result.embeddings]

def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]

def chunk_text(text: str, doc_name: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)
    return [
        {"text": chunk, "metadata": {"source": doc_name, "chunk_id": i}}
        for i, chunk in enumerate(chunks)
    ]
