import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("tynor_documents")

def add_documents(chunks: list[dict], embeddings: list[list[float]], doc_id: str):
    collection.add(
        documents=[c["text"] for c in chunks],
        embeddings=embeddings,
        metadatas=[c["metadata"] for c in chunks],
        ids=[f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    )

def search_documents(query_embedding: list[float], n_results: int = 5) -> list[str]:
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    return results["documents"][0]

def list_documents() -> list[str]:
    all_meta = collection.get()["metadatas"]
    sources = list(set(m["source"] for m in all_meta if m))
    return sources