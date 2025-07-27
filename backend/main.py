from datetime import datetime
from http.client import HTTPException
from uuid import uuid4
from fastapi import FastAPI, File, UploadFile, status
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from transformers import pipeline
import os
import shutil
from config import CHROMA_DIR, EMBEDDING_MODEL_NAME, SUMMARY_MODEL_NAME, CHUNK_SIZE, CHUNK_OVERLAP, SUMMARY_MAX_LENGTH, SUMMARY_MIN_LENGTH
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust if frontend runs elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


EMBEDDINGS = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
summarizer = pipeline("summarization", model=SUMMARY_MODEL_NAME)


# Upload endpoint
@app.post("/upload/{session_id}")
async def upload_file(session_id: str, file: UploadFile = File(...)):
    session_dir = os.path.join(CHROMA_DIR, session_id)
    if not os.path.exists(session_dir):
        raise HTTPException(status_code=404, detail="Invalid session ID")

    file_path = f"uploads/{session_id}_{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load file
    if file.filename.lower().endswith(".pdf"):
        loader = PyPDFLoader(file_path)
    elif file.filename.lower().endswith(".docx"):
        loader = Docx2txtLoader(file_path)
    else:
        return {"error": "Unsupported file type"}

    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    chunks = splitter.split_documents(documents)

    vectordb = Chroma(
        persist_directory=session_dir,
        embedding_function=EMBEDDINGS
    )
    vectordb.add_documents(chunks)
    vectordb.persist()

    return {"status": "uploaded"}


# QA endpoint
class QARequest(BaseModel):
    question: str
    session_id: str

@app.post("/qa")
def answer_question(req: QARequest):
    session_vector_dir = f"{CHROMA_DIR}/{req.session_id}"

    if not os.path.exists(session_vector_dir):
        raise HTTPException(status_code=404, detail="Invalid session ID")
    
    vectordb = Chroma(persist_directory=session_vector_dir, embedding_function=EMBEDDINGS)
    retriever = vectordb.as_retriever()
    docs = retriever.get_relevant_documents(req.question)
    context = "\n\n".join(doc.page_content for doc in docs)

    summary = summarizer(context, max_length=SUMMARY_MAX_LENGTH, min_length=SUMMARY_MIN_LENGTH, do_sample=False)

    return {
        "answer": summary[0]["summary_text"]
    }

@app.post("/session")
def create_session():
    session_id = str(uuid4())
    session_dir = os.path.join(CHROMA_DIR, session_id)
    os.makedirs(session_dir, exist_ok=True)
    
    with open(os.path.join(session_dir, "created.meta"), "w") as f:
        f.write(datetime.now().isoformat())

    return {"session_id": session_id}

@app.get("/sessions")
def list_sessions():
    if not os.path.exists(CHROMA_DIR):
        return {"sessions": []}
    return {
        "sessions": [
            name for name in os.listdir(CHROMA_DIR)
            if os.path.isdir(os.path.join(CHROMA_DIR, name))
        ]
    }

@app.delete("/session/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: str):
    session_dir = os.path.join(CHROMA_DIR, session_id)

    if not os.path.exists(session_dir):
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        shutil.rmtree(session_dir)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete session: {str(e)}")