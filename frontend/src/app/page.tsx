"use client";

import { useCallback, useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) setFile(e.target.files[0]);
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("File uploaded successfully");
    } catch {
      setUploadStatus("Upload failed");
    }
  }, [file]);

  const handleAsk = useCallback(async () => {
    if (!question) return;

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/qa`, {
        question,
      });
      setAnswer(response.data.answer);
    } catch {
      setAnswer("Failed to get answer");
    }
  }, [question]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Upload PDF & Ask Question</h1>

      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{ marginLeft: 10 }}
      >
        Upload
      </button>
      <p>{uploadStatus}</p>

      <hr style={{ margin: "20px 0" }} />

      <input
        type="text"
        placeholder="Ask your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
      <button
        onClick={handleAsk}
        disabled={!question}
        style={{ marginTop: 10 }}
      >
        Ask
      </button>

      {answer && (
        <div style={{ marginTop: 20 }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </main>
  );
}
