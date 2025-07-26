# 📄 AI-Powered PDF QA App

An AI-powered application that lets you upload PDFs and ask questions about their contents. It uses NLP techniques to retrieve relevant information and provide summarized answers.

---

## 🧠 Features

- Upload any PDF document.
- Ask natural language questions about the content.
- Get summarized answers using AI.
- Backend: FastAPI, LangChain, HuggingFace, ChromaDB.
- Frontend: Next.js (App Router).

---

## 🖥️ Run the Backend

### 1. Setup Python Environment

Use [`uv`](https://github.com/astral-sh/uv) (fast Python package manager) and create a virtual environment:

```bash
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
```
### 2. Install Dependencies
```bash
uv pip install -r requirements.txt
```

### 3. Start the FastAPI Server
```bash
uvicorn main:app --reload
```
This will start the backend on: http://localhost:8000

## 🌐 Run the Frontend (Next.js)

### 1. Set Environment Variables
Create a .env file in the frontend/ directory with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
### 2. Install Node Dependencies
```bash
cd frontend
npm install
```
### 3. Start Development Server
```bash
npm run dev
```
The frontend will be available at: http://localhost:3000
