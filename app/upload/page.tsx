"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function UploadPage() {
  const router = useRouter();
  const pathname = usePathname(); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "User");
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

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
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF and DOCX files are supported.");
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF or DOCX file first.");
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
        const errorText = await res.text();
        console.error("Backend Error Status:", res.status);
        console.error("Backend Error Message:", errorText);
        
        setError(`Backend Error (${res.status}): ${errorText || "Internal pipeline failure parsing this layout structure."}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      localStorage.setItem("aiResults", JSON.stringify(data));
      
      const fileMeta = {
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadDate: new Date().toLocaleDateString(),
      };
      localStorage.setItem("uploadedFile", JSON.stringify(fileMeta));

      router.push("/results");
      
    } catch (err) {
      console.error("Network Fetch Error:", err);
      setError("Something went wrong while connecting to the server. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUploadDisabled = loading || !selectedFile;

  return (
    <main style={pageStyle}>
      {/* Sidebar - Shared Component Logic Mapping */}
      <aside style={sidebarStyle}>
        <Sidebar userName={userName} />
      </aside>

      {/* Main Content Area */}
      <section style={mainStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "bold" }}>
            Create New Workspace
          </h1>

          {/* Stepper Indicator Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white" }}>
              <div style={stepActive}>1</div> Upload
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={stepInactive}>2</div> Process
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={stepInactive}>3</div> Study
            </div>
          </div>
        </div>

        {/* Upload Interaction Workspace Box Card */}
        <div
          style={{
            maxWidth: "620px",
            margin: "40px auto 0 auto",
            backgroundColor: "rgba(17, 24, 39, 0.75)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "34px",
            boxShadow: "0 12px 35px rgba(0,0,0,0.35)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: "600" }}>
            Import Your Study Materials
          </h2>

          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "26px" }}>
            Our AI will transform your content into organized notes, flashcards, and quizzes.
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
              transition: "border-color 0.2s ease",
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

            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "600" }}>Upload PDF or DOCX</h3>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Drag and drop or browse files</p>
            <p style={{ color: "#6b7280", fontSize: "12px" }}>Maximum 50MB per file</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {fileName && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
              <p style={{ color: "#86efac", margin: 0, fontSize: "14px" }}>Selected File: {fileName}</p>
              <button 
                onClick={handleRemoveFile}
                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: "bold", padding: "4px" }}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}

          {error && <p style={{ color: "#f87171", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

          <button
            onClick={handleUpload}
            disabled={isUploadDisabled}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: isUploadDisabled ? "#374151" : "linear-gradient(to right, #7c3aed, #9333ea)",
              color: isUploadDisabled ? "#9ca3af" : "white",
              fontWeight: "700",
              cursor: isUploadDisabled ? "not-allowed" : "pointer",
              fontSize: "15px",
              opacity: isUploadDisabled ? 0.8 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Processing..." : "Upload and Generate"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: "12px", marginTop: "24px" }}>
            <span>🔒 Secure Encryption</span>
            <span>⚡ AI Instant Analysis</span>
            <span>💾 Auto-Save Cloud Session</span>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Shared Core Sidebar Component Implementation ---
function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "▦" }, 
    { name: "Folders", path: "/folders", icon: "📁" }, 
    { name: "Settings", path: "/settings", icon: "⚙" }
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div>
        <h2 style={{ margin: "0 0 24px", fontSize: "18px", fontWeight: "bold" }}>✦ NotesTaker AI</h2>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <button style={{ backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 16px", fontWeight: "600", cursor: "pointer", width: "100%", marginBottom: "24px" }}>
            + New Study Set
          </button>
        </Link>
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
          {navItems.map((item) => {
            // Evaluates dashboard layout highlights if inside upload loop structure
            const isActive = item.path === "/dashboard" || pathname === item.path;
            return (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", color: isActive ? "white" : "#cbd5e1", backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer", fontSize: "14px" }}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", color: "#9ca3af", fontSize: "13px", marginTop: "auto" }}>
        <p style={{ margin: 0 }}>👤 {userName}</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>AI Study Workspace</p>
      </div>
    </div>
  );
}

// --- Layout Tokens Framework Mapping ---
const pageStyle = { minHeight: "100vh", display: "flex", background: "linear-gradient(to bottom right, #050816, #0b1023)", color: "white" } as const;
const sidebarStyle = { width: "250px", backgroundColor: "#11131a", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "24px 18px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "40px", overflowY: "auto" as const } as const;

const stepActive = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#8b5cf6",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "11px"
} as const;

const stepInactive = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#1f2937",
  color: "#9ca3af",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px"
} as const;