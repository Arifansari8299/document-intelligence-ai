import os, uuid, shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.document_parser import parse_document
from services.embedder import chunk_text, embed_texts
from db.vector_store import add_documents

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
    file_path = f"{UPLOAD_DIR}/{doc_id}{ext}"

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    text = parse_document(file_path, file.filename)
    chunks = chunk_text(text, file.filename)
    embeddings = embed_texts([c["text"] for c in chunks])

    add_documents(chunks, embeddings, doc_id)

    return {"message": "Document uploaded successfully", "doc_id": doc_id, "filename": file.filename}

@router.get("/documents")
async def get_documents():
    from db.vector_store import list_documents
    return {"documents": list_documents()}
