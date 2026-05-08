"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(
        "https://notestaker-backend-194267172594.us-central1.run.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
  setError("Upload failed. Please try again or check the file.");
  setLoading(false);
  return;
}

      const data = await res.json();
      localStorage.setItem("aiResults", JSON.stringify(data));

      router.push("/results");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(to bottom right, #050816, #0b1023)",
        color: "white",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#11131a",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>
            ✦ NotesTaker AI
          </h2>

          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#8b5cf6",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "24px",
            }}
          >
            + New Study Set
          </button>

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              color: "#cbd5e1",
              fontSize: "14px",
            }}
          >
            <span>▦ Dashboard</span>
            <span>📝 Notes</span>
            <span>▱ Flashcards</span>
            <span>▣ Quizzes</span>
            <span>📁 Folders</span>
          </nav>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "16px",
            color: "#9ca3af",
            fontSize: "13px",
          }}
        >
          ⚙ Settings
          <p style={{ marginTop: "14px" }}>👤 Janaki</p>
        </div>
      </aside>

      {/* Main Content */}
      <section
        style={{
          flex: 1,
          padding: "32px",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "40px" }}>
          Create New Workspace
        </h1>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "80px",
            marginBottom: "35px",
            color: "#9ca3af",
            fontSize: "12px",
            textTransform: "uppercase",
          }}
        >
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={stepActive}>1</div>
            Upload
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={stepInactive}>2</div>
            Process
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={stepInactive}>3</div>
            Study
          </div>
        </div>

        {/* Upload Card */}
        <div
          style={{
            maxWidth: "620px",
            margin: "0 auto",
            backgroundColor: "rgba(31, 41, 55, 0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "34px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
            Import Your Study Materials
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              marginBottom: "26px",
            }}
          >
            Our AI will transform your content into organized notes,
            flashcards, and quizzes.
          </p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed rgba(255,255,255,0.15)",
              borderRadius: "16px",
              padding: "42px 20px",
              backgroundColor: "rgba(17, 24, 39, 0.85)",
              cursor: "pointer",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                backgroundColor: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                fontSize: "24px",
              }}
            >
              📄
            </div>

            <h3 style={{ margin: "0 0 8px" }}>Upload PDF</h3>

            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              Drag and drop or browse files
            </p>

            <p style={{ color: "#6b7280", fontSize: "12px" }}>
              Maximum 50MB per file
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {fileName && (
            <p style={{ color: "#86efac", marginBottom: "16px" }}>
              Selected File: {fileName}
            </p>
          )}

          {error && (
            <p style={{ color: "#f87171", marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: loading
                ? "#6b7280"
                : "linear-gradient(to right, #7c3aed, #9333ea)",
              color: "white",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "15px",
            }}
          >
            {loading ? "Processing..." : "Upload and Generate"}
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#6b7280",
              fontSize: "12px",
              marginTop: "24px",
            }}
          >
            <span>🔒 Secure Encryption</span>
            <span>⚡ AI Instant Analysis</span>
            <span>Import from Google Drive</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const stepActive = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#a78bfa",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 8px",
  fontWeight: "bold",
} as const;

const stepInactive = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#1f2937",
  color: "#9ca3af",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 8px",
} as const;