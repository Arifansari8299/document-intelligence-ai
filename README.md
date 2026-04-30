# 🧠 Gemini-RAG-Explorer

A full-stack Retrieval-Augmented Generation (RAG) application that allows users to upload documents and "chat" with them. Powered by Google's Gemini AI, FastAPI, and React, this app intelligently searches through your uploaded PDFs, Word documents, and text files to provide precise, context-aware answers to your questions.

## ✨ Features

- **📄 Multi-Format Document Upload:** Supports `.pdf`, `.docx`, and `.txt` files.
- **🔍 Intelligent Document Processing:** Automatically extracts text and chunks it for efficient vector search using LangChain.
- **🧠 Advanced AI Embeddings:** Uses Google's `gemini-embedding-001` to convert document chunks into high-quality vector representations.
- **⚡ Fast Vector Database:** Uses local **ChromaDB** for lightning-fast semantic search.
- **🤖 Context-Aware Chat:** Leverages `gemini-flash-latest` to answer questions strictly based on the context of the uploaded documents.
- **🎨 Modern User Interface:** Built with React, Vite, and Tailwind CSS 4 for a smooth, responsive, and animated user experience.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **AI & LLM:** Google Generative AI (Gemini)
- **RAG Orchestration:** LangChain
- **Vector Database:** ChromaDB
- **Document Parsing:** PyMuPDF (`fitz`) for PDFs, `python-docx` for Word documents

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Gemini-RAG-Explorer.git
cd Gemini-RAG-Explorer
```

### 2. Backend Setup
Navigate to the Backend directory and set up the Python environment:
```bash
cd Backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file inside the `Backend` directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

**Run the Backend Server:**
```bash
python -m uvicorn main:app --reload
```
The FastAPI backend will start running on `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and start the app:
```bash
cd frontend

# Install Node dependencies
npm install

# Run the Vite development server
npm run dev
```
The React frontend will start running on `http://localhost:5173`.

---

## 📁 Project Structure

```text
├── Backend/
│   ├── db/               # ChromaDB vector store logic
│   ├── routes/           # FastAPI endpoints (upload, chat)
│   ├── services/         # Document parsers, embeddings logic
│   ├── main.py           # FastAPI application entry point
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/              # React components, pages, and hooks
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite configuration
└── README.md
```

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for improvements.

## 📝 License
This project is licensed under the MIT License.
