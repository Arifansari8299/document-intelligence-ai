from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

# Initialize the embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_texts(texts: list[str]) -> list[list[float]]:
    embeddings = model.encode(texts)
    return embeddings.tolist()

def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]

def chunk_text(text: str, doc_name: str) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)
    return [
        {"text": chunk, "metadata": {"source": doc_name, "chunk_id": i}}
        for i, chunk in enumerate(chunks)
    ]
