import chromadb
import os

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
    upload_dir = "./uploads"
    if not os.path.exists(upload_dir):
        return []
    return [
        f for f in os.listdir(upload_dir)
        if os.path.isfile(os.path.join(upload_dir, f))
    ]

def delete_document_by_source(source_name: str):
    results = collection.get(where={"source": source_name})
    ids = results.get("ids", [])
    if ids:
        collection.delete(ids=ids)

def sync_chromadb_with_uploads():
    """Remove ChromaDB chunks whose source file no longer exists in uploads."""
    upload_dir = "./uploads"
    existing_files = set(os.listdir(upload_dir)) if os.path.exists(upload_dir) else set()
    data = collection.get()
    ids_to_delete = [
        data["ids"][i]
        for i, meta in enumerate(data["metadatas"])
        if meta and meta.get("source") not in existing_files
    ]
    if ids_to_delete:
        collection.delete(ids=ids_to_delete)
        print(f"[SYNC] Removed {len(ids_to_delete)} orphan chunks from ChromaDB")
