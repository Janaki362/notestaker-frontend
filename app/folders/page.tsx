"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function FoldersPage() {
  const router = useRouter();
  const [savedSets, setSavedSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("All Documents");

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

  // Derived state: Get unique folder names (Defaults to "Uncategorized" if no folder exists)
  const folders = ["All Documents", "Uncategorized", "Favorites"]; 
  
  const displayedSets = activeFolder === "All Documents" 
    ? savedSets 
    : activeFolder === "Uncategorized" 
      ? savedSets.filter(set => !set.folder)
      : savedSets.filter(set => set.folder === activeFolder);

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}><Sidebar /></aside>
      
      <section style={mainStyle}>
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "32px", margin: "0 0 8px 0" }}>Folders</h1>
            <p style={{ color: "#9ca3af", margin: 0 }}>Organize your study materials.</p>
          </div>
          <button style={secondaryButtonStyle}>+ Create New Folder</button>
        </div>

        {/* Folder Tabs */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setActiveFolder(folder)}
              style={{
                background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: activeFolder === folder ? "bold" : "normal",
                color: activeFolder === folder ? "#c4b5fd" : "#9ca3af", transition: "color 0.2s"
              }}
            >
              📁 {folder}
            </button>
          ))}
        </div>

        {/* Documents in Selected Folder */}
        {loading ? (
          <div style={{ color: "#9ca3af" }}>Loading folder contents...</div>
        ) : displayedSets.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
            <p>No documents found in this folder.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {displayedSets.map((set) => (
              <Link key={set.id} href={`/results?id=${set.id}`} style={{ textDecoration: "none", color: "white" }}>
                <div style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#8b5cf6"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(139, 92, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📄</div>
                    <div>
                      <h3 style={{ fontSize: "16px", margin: "0 0 4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{set.fileName}</h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{set.createdAt ? new Date(set.createdAt.toMillis()).toLocaleDateString() : "Just now"}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// --- Simplified Sidebar ---
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
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", color: isActive ? "white" : "#cbd5e1", backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer", transition: "background-color 0.2s" }}>
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

// --- Styles ---
const pageStyle = { minHeight: "100vh", display: "flex", background: "linear-gradient(to bottom right, #050816, #0b1023)", color: "white" } as const;
const sidebarStyle = { width: "250px", backgroundColor: "#11131a", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "24px 18px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "40px", overflowY: "auto" } as const;
const cardStyle = { backgroundColor: "rgba(17,24,39,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", transition: "all 0.2s", cursor: "pointer" } as const;
const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 16px", fontWeight: "600", cursor: "pointer" } as const;
const secondaryButtonStyle = { backgroundColor: "transparent", color: "#a78bfa", border: "1px solid #8b5cf6", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" } as const;
const profileStyle = { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", color: "#9ca3af", fontSize: "13px" } as const;