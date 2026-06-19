"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

interface StudyDocument {
  id: string;
  fileName: string;
  mode: string;
  detectedType?: string;
  createdAt: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || currentUser.email || "User");
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchHistoryFromFirebase = async () => {
      setLoading(true);
      setError("");

      try {
        const q = query(
          collection(db, "studySets"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedDocs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as StudyDocument[];

        setDocuments(fetchedDocs);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError("Could not load your recent documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryFromFirebase();
  }, [user]);

  const formatDate = (dateInput: any) => {
    if (!dateInput) return "Recently";
    if (dateInput.toDate) return dateInput.toDate().toLocaleDateString();
    if (dateInput._seconds) return new Date(dateInput._seconds * 1000).toLocaleDateString();
    return new Date(dateInput).toLocaleDateString();
  };

  const getModeColor = (mode?: string) => {
    const normalizedMode = mode?.toLowerCase();
    if (normalizedMode === "legal") return { backgroundColor: "#fef2f2", color: "#dc2626" };
    if (normalizedMode === "medical") return { backgroundColor: "#ecfeff", color: "#0891b2" };
    if (normalizedMode === "business") return { backgroundColor: "#f0fdf4", color: "#16a34a" };
    return { backgroundColor: "#eff6ff", color: "#2563eb" };
  };

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}>
        <Sidebar userName={userName} pathname={pathname} />
      </aside>

      <section style={mainStyle}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={titleStyle}>Welcome back, {userName.split(" ")[0]} 👋</h1>
          <p style={subtitleStyle}>Here is an overview of your recent AI study workspaces.</p>
          <p style={planTextStyle}>Current Plan: <strong>Basic</strong></p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📄</div>
            <div>
              <p style={statLabelStyle}>Documents</p>
              <h3 style={statValueStyle}>{loading ? "-" : documents.length}</h3>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, backgroundColor: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" }}>🧠</div>
            <div>
              <p style={statLabelStyle}>Flashcards</p>
              <h3 style={statValueStyle}>{loading ? "-" : documents.length * 12}</h3>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, backgroundColor: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>📝</div>
            <div>
              <p style={statLabelStyle}>Quiz Questions</p>
              <h3 style={statValueStyle}>{loading ? "-" : documents.length * 5}</h3>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statIconStyle, backgroundColor: "#f3e8ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>⚡</div>
            <div>
              <p style={statLabelStyle}>AI Insights</p>
              <h3 style={statValueStyle}>{loading ? "-" : documents.length * 4}</h3>
            </div>
          </div>
        </div>

        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Recent Workspaces</h2>
          <Link href="/upload" style={{ textDecoration: "none" }}>
            <button style={smallButtonStyle}>+ New Upload</button>
          </Link>
        </div>

        {loading ? (
          <div style={loadingStyle}>Loading your workspaces...</div>
        ) : error ? (
          <div style={errorStyle}>{error}</div>
        ) : documents.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: "42px", marginBottom: "16px" }}>📄</div>
            <h3 style={emptyTitleStyle}>No documents yet</h3>
            <p style={emptyTextStyle}>Upload your first file to generate AI notes, flashcards, and quizzes.</p>
            <Link href="/upload" style={{ textDecoration: "none" }}>
              <button style={primaryButtonStyle}>Upload a Document</button>
            </Link>
          </div>
        ) : (
          <div style={documentGridStyle}>
            {documents.map((doc, index) => {
              const modeColor = getModeColor(doc.mode);
              // Safe fallback key to prevent React errors
              const safeKey = doc.id ? doc.id : `fallback-doc-${index}`;

              return (
                <Link
                  key={safeKey}
                  href={doc.id ? `/results?id=${doc.id}` : "#"}
                  style={{ textDecoration: "none" }}
                >
                  <div style={documentCardStyle}>
                    <div style={cardTopStyle}>
                      <div style={documentIconStyle}>📝</div>
                      <span style={{ ...modeBadgeStyle, backgroundColor: modeColor.backgroundColor, color: modeColor.color }}>
                        {doc.mode || "Student"}
                      </span>
                    </div>
                    <h3 style={documentTitleStyle}>{doc.fileName || `Document ${index + 1}`}</h3>
                    <div style={{ marginTop: "12px" }}>
                      <p style={processedTextStyle}>Processed on {formatDate(doc.createdAt)}</p>
                      <p style={viewTextStyle}>View Study Materials →</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Sidebar({ userName, pathname }: { userName: string; pathname: string }) {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "▦" },
    { name: "Folders", path: "/folders", icon: "📁" },
    { name: "Settings", path: "/settings", icon: "⚙" },
  ];
  return (
    <div style={sidebarInnerStyle}>
      <div>
        <h2 style={logoStyle}><span style={{ color: "#2563eb", marginRight: "6px" }}>✦</span> NotesTaker AI</h2>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <button style={{ ...primaryButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button>
        </Link>
        <nav style={navStyle}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{ ...navItemStyle, color: isActive ? "#2563eb" : "#4b5563", backgroundColor: isActive ? "#eff6ff" : "transparent", fontWeight: isActive ? "700" : "500" }}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div style={userBoxStyle}>
        <div style={userNameStyle}><span style={avatarStyle}>👤</span>{userName}</div>
        <p style={workspaceLabelStyle}>AI Study Workspace</p>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif" } as const;
const sidebarStyle = { width: "260px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "24px", zIndex: 10 } as const;
const sidebarInnerStyle = { height: "100%", display: "flex", flexDirection: "column" } as const;
const mainStyle = { flex: 1, padding: "48px 64px", overflowY: "auto", backgroundColor: "#ffffff" } as const;
const titleStyle = { fontSize: "32px", margin: "0 0 8px 0", color: "#111827", fontWeight: "800", letterSpacing: "-0.5px" } as const;
const subtitleStyle = { color: "#6b7280", margin: 0, fontSize: "15px" } as const;
const planTextStyle = { color: "#6b7280", marginTop: "8px", fontSize: "14px" } as const;
const primaryButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" } as const;
const smallButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "10px 14px", fontWeight: "700", cursor: "pointer", fontSize: "13px" } as const;
const statsGridStyle = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" } as const;
const statCardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "22px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" } as const;
const statIconStyle = { width: "46px", height: "46px", borderRadius: "12px", backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" } as const;
const statLabelStyle = { margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", fontWeight: "700", textTransform: "uppercase" } as const;
const statValueStyle = { margin: 0, fontSize: "24px", fontWeight: "800", color: "#111827" } as const;
const sectionHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" } as const;
const sectionTitleStyle = { fontSize: "20px", color: "#111827", fontWeight: "800", margin: 0 } as const;
const loadingStyle = { padding: "40px", textAlign: "center", color: "#6b7280", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px dashed #d1d5db" } as const;
const errorStyle = { padding: "20px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "12px", border: "1px solid #fecaca" } as const;
const emptyStateStyle = { padding: "64px 20px", textAlign: "center", backgroundColor: "#f9fafb", borderRadius: "16px", border: "1px dashed #d1d5db" } as const;
const emptyTitleStyle = { margin: "0 0 8px 0", fontSize: "18px", color: "#111827" } as const;
const emptyTextStyle = { margin: "0 0 24px 0", color: "#6b7280", fontSize: "14px" } as const;
const documentGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "22px" } as const;
const documentCardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", minHeight: "140px" } as const;
const cardTopStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" } as const;
const documentIconStyle = { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" } as const;
const modeBadgeStyle = { padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" } as const;
const documentTitleStyle = { margin: "0 0 8px 0", fontSize: "16px", fontWeight: "800", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } as const;
const processedTextStyle = { margin: "0 0 6px 0", fontSize: "13px", color: "#6b7280" } as const;
const viewTextStyle = { margin: 0, fontSize: "12px", color: "#2563eb", fontWeight: "700" } as const;
const logoStyle = { margin: "0 0 24px", fontSize: "18px", color: "#111827", fontWeight: "800", letterSpacing: "-0.5px" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" } as const;
const navItemStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.2s" } as const;
const userBoxStyle = { borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "auto" } as const;
const userNameStyle = { display: "flex", alignItems: "center", gap: "8px", color: "#111827", fontWeight: "700", fontSize: "14px", margin: 0 } as const;
const avatarStyle = { backgroundColor: "#e5e7eb", borderRadius: "50%", padding: "4px" } as const;
const workspaceLabelStyle = { margin: "4px 0 0 32px", fontSize: "12px", color: "#6b7280" } as const;