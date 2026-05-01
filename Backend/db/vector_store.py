import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("tynor_documents_v2")

def add_documents(chunks: list[dict], embeddings: list[list[float]], doc_id: str):
    collection.add(
        documents=[c["text"] for c in chunks],
        embeddings=embeddings,
        metadatas=[c["metadata"] for c in chunks],
        ids=[f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    )

def search_documents(query_embedding: list[float], n_results: int = 5) -> list[str]:
    total = collection.count()
    if total == 0:
        return []
    actual_n = min(n_results, total)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=actual_n
    )
    return results["documents"][0]

def list_documents() -> list[str]:
    import os
    upload_dir = "./uploads"
    if not os.path.exists(upload_dir):
        return []
    files = [
        f for f in os.listdir(upload_dir)
        if os.path.isfile(os.path.join(upload_dir, f))
    ]
    return files

def delete_document_by_source(source_name: str):
    """Remove all chunks for a given source from ChromaDB."""
    results = collection.get(where={"source": source_name})
    ids = results.get("ids", [])
    if ids:
        collection.delete(ids=ids)

def clear_all_documents():
    """Delete all documents from ChromaDB collection."""
    all_ids = collection.get()["ids"]
    if all_ids:
        collection.delete(ids=all_ids)