"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [savedSets, setSavedSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "studySets"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedSets: any[] = [];
          querySnapshot.forEach((doc) => {
             fetchedSets.push({ id: doc.id, ...doc.data() });
          });
          fetchedSets.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
          setSavedSets(fetchedSets);
        } catch (error) {
          console.error("Error fetching study sets:", error);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (setId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this study set? This cannot be undone.");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "studySets", setId));
      setSavedSets((prevSets) => prevSets.filter((set) => set.id !== setId));
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete the study set. Please try again.");
    }
  };

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}><Sidebar /></aside>
      
      <section style={mainStyle}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", margin: "0 0 8px 0" }}>Your Dashboard</h1>
          <p style={{ color: "#9ca3af", margin: 0 }}>Manage your saved study sets and recent uploads.</p>
        </div>

        {loading ? (
          <div style={{ color: "#9ca3af" }}>Loading your study sets...</div>
        ) : savedSets.length === 0 ? (
          /* --- DESIGN FIXED EMPTY STATE GRAPHIC --- */
          <div style={{ backgroundColor: "rgba(17,24,39,0.4)", border: "1px dashed rgba(255,255,255,0.08)", padding: "60px 40px", textAlign: "center", borderRadius: "18px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto", fontSize: "28px", border: "1px solid rgba(255,255,255,0.05)" }}>
              📚
            </div>
            <h2 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: "600" }}>No Study Sets Yet</h2>
            <p style={{ color: "#9ca3af", marginBottom: "24px", fontSize: "14px", maxWidth: "320px", margin: "0 auto 24px auto", lineHeight: "1.5" }}>
              Upload a document to generate your first set of AI summaries, flashcards, and quizzes.
            </p>
            <Link href="/upload"><button style={purpleButtonStyle}>+ Create New Study Set</button></Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {savedSets.map((set) => (
              <div key={set.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📄</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {set.createdAt ? new Date(set.createdAt.toMillis()).toLocaleDateString() : "Just now"}
                    </span>
                    <button onClick={() => handleDelete(set.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", opacity: 0.6 }}>🗑️</button>
                  </div>
                </div>
                
                <h3 style={{ fontSize: "18px", margin: "0 0 12px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{set.fileName}</h3>
                <div style={{ display: "flex", gap: "12px", color: "#9ca3af", fontSize: "13px", marginBottom: "24px" }}>
                  <span>{set.data?.flashcards?.length || 0} Flashcards</span><span>•</span><span>{set.data?.quiz?.length || 0} Questions</span>
                </div>

                <Link href={`/results?id=${set.id}`} style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>
                    Open Study Set
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// --- Sidebar Component ---
function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { if (user) setUserName(user.displayName || user.email || "User"); });
    return () => unsubscribe();
  }, []);
  const navItems = [{ name: "Dashboard", path: "/dashboard", icon: "▦" }, { name: "Folders", path: "/folders", icon: "📁" }, { name: "Settings", path: "/settings", icon: "⚙" }];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>✦ NotesTaker AI</h2>
      <Link href="/upload" style={{ textDecoration: "none" }}><button style={{ ...purpleButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button></Link>
      <nav style={navStyle}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", color: isActive ? "white" : "#cbd5e1", backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer" }}>
                <span>{item.icon}</span><span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div style={{ ...profileStyle, marginTop: "auto" }}><p style={{ margin: 0 }}>👤 {userName}</p><p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>AI Study Workspace</p></div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", background: "linear-gradient(to bottom right, #050816, #0b1023)", color: "white" } as const;
const sidebarStyle = { width: "250px", backgroundColor: "#11131a", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "24px 18px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "40px", overflowY: "auto" } as const;
const cardStyle = { backgroundColor: "rgba(17,24,39,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" } as const;
const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 16px", fontWeight: "600", cursor: "pointer" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" } as const;
const profileStyle = { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", color: "#9ca3af", fontSize: "13px" } as const;