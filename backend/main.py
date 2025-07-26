from fastapi import FastAPI, File, UploadFile, Depends
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader
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

def get_vectordb():
    return Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=EMBEDDINGS
    )

# Upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load and chunk PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    chunks = splitter.split_documents(documents)

    # Save to Chroma
    Chroma.from_documents(
        chunks,
        EMBEDDINGS,
        persist_directory=CHROMA_DIR
    ).persist()

    return {"status": "uploaded"}


# QA endpoint
class QARequest(BaseModel):
    question: str

@app.post("/qa")
def answer_question(req: QARequest, vectordb = Depends(get_vectordb)):
    retriever = vectordb.as_retriever()
    docs = retriever.get_relevant_documents(req.question)
    context = "\n\n".join(doc.page_content for doc in docs)

    summary = summarizer(context, max_length=SUMMARY_MAX_LENGTH, min_length=SUMMARY_MIN_LENGTH, do_sample=False)

    return {
        "answer": summary[0]["summary_text"]
    }
