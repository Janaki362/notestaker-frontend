"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();

      localStorage.setItem("aiResults", JSON.stringify(data));

      router.push("/results");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading. Please check backend API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link href="/">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </Link>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>AI Study Platform</h1>
        <h2>Upload Document</h2>
        <p style={{ color: "#555" }}>
          Upload your PDF to generate summaries, flashcards, and quizzes.
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: "2px dashed gray",
            padding: "30px",
            margin: "20px auto",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <p>Drag & Drop your file here</p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "10px 16px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            📄 Browse files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {fileName && (
          <p style={{ color: "green" }}>Selected File: {fileName}</p>
        )}

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: loading ? "gray" : "black",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Upload"}
        </button>
      </div>
    </main>
  );
}