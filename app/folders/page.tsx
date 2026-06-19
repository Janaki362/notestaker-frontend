"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
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

  const folders = ["All Documents", "Uncategorized", "Favorites"]; 
  
  const displayedSets = activeFolder === "All Documents" 
    ? savedSets 
    : activeFolder === "Uncategorized" 
      ? savedSets.filter(set => !set.folder)
      : savedSets.filter(set => set.folder === activeFolder);

  const handleToggleFavorite = async (e: React.MouseEvent, setId: string, currentFolder: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isFavorite = currentFolder === "Favorites";
    const newFolder = isFavorite ? "" : "Favorites";

    try {
      const docRef = doc(db, "studySets", setId);
      await updateDoc(docRef, { folder: newFolder });
      setSavedSets(prevSets => prevSets.map(set => 
        set.id === setId ? { ...set, folder: newFolder } : set
      ));
    } catch (error) {
      console.error("Error updating favorite status:", error);
      alert("Failed to update favorite status.");
    }
  };

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}><Sidebar /></aside>
      
      <section style={mainStyle}>
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#111827", fontWeight: "700", letterSpacing: "-0.5px" }}>Folders</h1>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "15px" }}>Organize your study materials.</p>
          </div>
          <button style={secondaryButtonStyle}>+ Create New Folder</button>
        </div>

        <div style={{ display: "flex", gap: "24px", marginBottom: "32px", borderBottom: "1px solid #e5e7eb" }}>
          {folders.map(folder => (
            <button 
              key={folder}
              onClick={() => setActiveFolder(folder)}
              style={{
                background: "none", border: "none", cursor: "pointer", fontSize: "15px", 
                fontWeight: activeFolder === folder ? "600" : "500",
                color: activeFolder === folder ? "#2563eb" : "#6b7280", 
                paddingBottom: "12px",
                borderBottom: activeFolder === folder ? "2px solid #2563eb" : "2px solid transparent",
                transition: "all 0.2s"
              }}
            >
              📁 {folder}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: "#6b7280" }}>Loading folder contents...</div>
        ) : displayedSets.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", backgroundColor: "#f9fafb", borderRadius: "16px", border: "1px dashed #d1d5db" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>No documents yet</h3>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>Create folders to organize your study materials.</p>
            <button style={secondaryButtonStyle}>+ Create Folder</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {displayedSets.map((set) => (
              <Link key={set.id} href={`/results?id=${set.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📄</div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 4px 0", maxWidth: "160px" }}>{set.fileName}</h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{set.createdAt ? new Date(set.createdAt.toMillis()).toLocaleDateString() : "Just now"}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(e, set.id, set.folder)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: set.folder === "Favorites" ? "#f59e0b" : "#d1d5db" }}
                    >
                      {set.folder === "Favorites" ? "★" : "☆"}
                    </button>
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

function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  useEffect(() => { onAuthStateChanged(auth, (user) => { if (user) setUserName(user.displayName || user.email || "User"); }); }, []);
  const navItems = [{ name: "Dashboard", path: "/dashboard", icon: "▦" }, { name: "Folders", path: "/folders", icon: "📁" }, { name: "Settings", path: "/settings", icon: "⚙" }];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: "18px", color: "#111827", fontWeight: "700" }}>✦ NotesTaker AI</h2>
      <Link href="/upload" style={{ textDecoration: "none" }}><button style={{ ...primaryButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button></Link>
      <nav style={navStyle}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", color: pathname === item.path ? "#2563eb" : "#4b5563", backgroundColor: pathname === item.path ? "#eff6ff" : "transparent" }}>
              <span>{item.icon}</span><span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", backgroundColor: "#ffffff", fontFamily: "'Urbanist', 'Inter', sans-serif" } as const;
const sidebarStyle = { width: "260px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "24px" } as const;
const mainStyle = { flex: 1, padding: "48px 64px", backgroundColor: "#ffffff" } as const;
const cardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", transition: "all 0.2s", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" } as const;
const primaryButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 16px", fontWeight: "600", fontSize: "14px", cursor: "pointer" } as const;
const secondaryButtonStyle = { backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "6px" } as const;