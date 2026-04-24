"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setProgress(0);
    }
  };

  const handleUpload = () => {
    if (!fileName) return;

    let value = 0;
    const timer = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
        router.push("/results");
      }
    }, 300);
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
        <h1 style={{ marginBottom: "8px" }}>AI Study Platform</h1>
        <h2 style={{ marginBottom: "10px", fontSize: "22px" }}>
          Upload Document
        </h2>
        <p style={{ color: "#555", marginBottom: "24px" }}>
          Upload your file to generate summaries, flashcards, and quizzes.
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
          <p style={{ marginBottom: "12px" }}>Drag & Drop your file here</p>

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
            id="fileUpload"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {fileName && (
          <p style={{ marginTop: "10px", color: "green" }}>
            Selected File: {fileName}
          </p>
        )}

        {progress > 0 && (
          <>
            <div
              style={{
                width: "100%",
                maxWidth: "320px",
                height: "18px",
                backgroundColor: "#ddd",
                borderRadius: "10px",
                margin: "20px auto 10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "green",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            <p>{progress}% uploaded</p>
          </>
        )}

        <button
          onClick={handleUpload}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>
    </main>
  );
}