# Parse PDF/DOCX/TXT
import fitz  # PyMuPDF
from docx import Document
from pathlib import Path

def parse_document(file_path: str, filename: str) -> str:
    ext = Path(filename).suffix.lower()
    
    if ext == ".pdf":
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    
    elif ext == ".docx":
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    raise ValueError(f"Unsupported file type: {ext}")