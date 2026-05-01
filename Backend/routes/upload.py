import os, uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.document_parser import parse_document
from services.embedder import chunk_text, embed_texts
from db.vector_store import add_documents, list_documents, delete_document_by_source

router = APIRouter()
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    allowed = {".pdf", ".docx", ".txt"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(400, "Only PDF, DOCX, TXT allowed")

    doc_id = str(uuid.uuid4())
    # Save with original filename to keep it recognizable
    safe_filename = f"{doc_id}_{file.filename}"
    file_path = f"{UPLOAD_DIR}/{safe_filename}"

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = parse_document(file_path, file.filename)
    chunks = chunk_text(text, safe_filename)
    embeddings = embed_texts([c["text"] for c in chunks])

    add_documents(chunks, embeddings, doc_id)

    return {"message": "Document uploaded successfully", "doc_id": doc_id, "filename": safe_filename}

@router.get("/documents")
async def get_documents():
    return {"documents": list_documents()}

@router.delete("/documents/{filename}")
async def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")
    os.remove(file_path)
    # Also clean ChromaDB entries for this file
    delete_document_by_source(filename)
    return {"message": f"{filename} deleted successfully"}
