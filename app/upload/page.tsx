"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function UploadPage() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [mode, setMode] = useState<"student" | "legal" | "medical" | "business">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const [user, setUser] = useState<any>(null); // Added user state to save to db

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserName(currentUser.displayName || currentUser.email || "User");
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setFileName(file.name); setError(""); }
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
    if (!selectedFile || !user) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("mode", mode);

    try {
      // Call the production Cloud Run URL
      const res = await fetch("https://notestaker-backend-194267172594.us-central1.run.app/upload", {
        method: "POST",
        body: formData,
      });

      // --- Smart Validation Error Handling ---
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Catch Alekhya's document mismatch 422 error
        if (res.status === 422) {
          throw new Error(`⚠️ ${errorData.error} \n💡 Tip: ${errorData.tip || `Try using ${errorData.suggestedMode} mode instead.`}`);
        }
        
        const errorMessage = errorData.error 
          ? (errorData.tip ? `${errorData.error} ${errorData.tip}` : errorData.error)
          : "Upload failed. Please check your network or try again.";
        throw new Error(errorMessage);
      }

      // --- Capture the new AI Metadata ---
      const data = await res.json();
      
      // Save to Firebase Database
      const docRef = await addDoc(collection(db, "studySets"), {
        userId: user.uid,
        fileName: selectedFile.name,
        data: data,
        mode: data.mode || mode, // The actual mode used
        detectedType: data.detectedType || "unknown", // What Vertex AI detected
        cached: data.cached || false, // Did it skip the AI billing cost?
        createdAt: serverTimestamp(),
      });

      // Navigate to results passing the newly created document ID
      router.push(`/results?id=${docRef.id}`);

    } catch (err: any) {
      // Displays the exact backend error dynamically
      setError(err.message || "Something went wrong while connecting to the server.");
      setLoading(false);
    }
  };

  const isUploadDisabled = loading || !selectedFile;

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}><Sidebar userName={userName} pathname={pathname} /></aside>
      <section style={mainStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", margin: 0, fontWeight: "800", color: "#111827" }}>Create New Workspace</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111827" }}><div style={stepActive}>1</div> Upload</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af" }}><div style={stepInactive}>2</div> Process</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af" }}><div style={stepInactive}>3</div> Study</div>
          </div>
        </div>

        <div style={{ maxWidth: "620px", margin: "40px auto 0 auto", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", marginBottom: "8px", fontWeight: "700" }}>Import Your Study Materials</h2>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "32px" }}>Our AI will transform your content into organized notes, flashcards, and quizzes.</p>

          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Select Study Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", cursor: "pointer", fontSize: "14px", outline: "none", transition: "border-color 0.2s" }} onFocus={(e) => e.target.style.borderColor = "#2563eb"} onBlur={(e) => e.target.style.borderColor = "#d1d5db"}>
              <option value="student">Student</option>
              <option value="legal">Legal</option>
              <option value="medical">Medical</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...dropZoneStyle,
              borderColor: selectedFile ? "#2563eb" : "#d1d5db",
              backgroundColor: selectedFile ? "#eff6ff" : "#fafafa",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.backgroundColor = "#eff6ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = selectedFile ? "#2563eb" : "#d1d5db";
              e.currentTarget.style.backgroundColor = selectedFile ? "#eff6ff" : "#fafafa";
            }}
          >
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>
              📄
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Upload PDF or DOCX</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px 0" }}>Click or drop files here</p>
            <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>Maximum 50MB per file</p>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          {fileName && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
              <p style={{ color: "#059669", margin: 0, fontSize: "14px", fontWeight: "600", backgroundColor: "#ecfdf5", padding: "6px 12px", borderRadius: "8px", border: "1px solid #a7f3d0" }}>✓ Selected: {fileName}</p>
              <button onClick={handleRemoveFile} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", cursor: "pointer", fontSize: "12px", fontWeight: "bold", padding: "6px 10px", borderRadius: "8px" }} title="Remove file">✕</button>
            </div>
          )}
          
          {error && <p style={{ color: "#dc2626", marginBottom: "20px", fontSize: "14px", fontWeight: "600", padding: "10px", backgroundColor: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca", whiteSpace: "pre-line" }}>{error}</p>}

          <button onClick={handleUpload} disabled={isUploadDisabled} style={{ ...uploadButtonStyle, backgroundColor: isUploadDisabled ? "#e5e7eb" : "#2563eb", color: isUploadDisabled ? "#9ca3af" : "white", cursor: isUploadDisabled ? "not-allowed" : "pointer", boxShadow: isUploadDisabled ? "none" : "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
            {loading ? "Processing Document..." : "Upload and Generate"}
          </button>
          
          <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: "13px", fontWeight: "500", marginTop: "32px", padding: "0 10px" }}>
            <span>🔒 Secure Encryption</span>
            <span>⚡ AI Instant Analysis</span>
            <span>💾 Auto-Save Cloud Session</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ userName, pathname }: { userName: string; pathname: string }) {
  const navItems = [{ name: "Dashboard", path: "/dashboard", icon: "▦" }, { name: "Folders", path: "/folders", icon: "📁" }, { name: "Settings", path: "/settings", icon: "⚙" }];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div>
        <h2 style={{ margin: "0 0 24px", fontSize: "18px", color: "#111827", fontWeight: "700", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#2563eb", marginRight: "6px" }}>✦</span>NotesTaker AI
        </h2>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <button style={{ ...primaryButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button>
        </Link>
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", color: isActive ? "#2563eb" : "#4b5563", backgroundColor: isActive ? "#eff6ff" : "transparent", fontWeight: isActive ? "600" : "500", cursor: "pointer", transition: "background-color 0.2s" }}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111827", fontWeight: "600", fontSize: "14px", margin: 0 }}>
          <span style={{ backgroundColor: "#e5e7eb", borderRadius: "50%", padding: "4px" }}>👤</span> {userName}
        </div>
        <p style={{ margin: "4px 0 0 32px", fontSize: "12px", color: "#6b7280" }}>AI Study Workspace</p>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", backgroundColor: "#ffffff", fontFamily: "'Urbanist', 'Inter', sans-serif" } as const;
const sidebarStyle = { width: "260px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "24px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "48px 64px", overflowY: "auto" as const, backgroundColor: "#ffffff" } as const;
const stepActive = { width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" } as const;
const stepInactive = { width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#f3f4f6", color: "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "12px" } as const;
const dropZoneStyle = { border: "2px dashed #d1d5db", borderRadius: "16px", padding: "48px 20px", backgroundColor: "#fafafa", cursor: "pointer", marginBottom: "24px", transition: "all 0.2s ease" };
const uploadButtonStyle = { width: "100%", padding: "16px", borderRadius: "12px", border: "none", fontWeight: "700", fontSize: "15px", transition: "all 0.2s ease" };
const primaryButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" };