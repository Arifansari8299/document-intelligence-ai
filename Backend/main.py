from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes.upload import router as upload_router
from routes.chat import router as chat_router
from db.vector_store import sync_chromadb_with_uploads

app = FastAPI(title="Tynor Document Intelligence API")

@app.on_event("startup")
async def startup_event():
    sync_chromadb_with_uploads()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")