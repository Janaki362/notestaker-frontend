"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await updateProfile(user, { displayName: displayName });
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) return null;

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}><Sidebar /></aside>
      
      <section style={mainStyle}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", margin: "0 0 8px 0" }}>Settings</h1>
          <p style={{ color: "#9ca3af", margin: 0 }}>Manage your account preferences.</p>
        </div>

        <div style={contentContainer}>
          <section style={cardStyle}>
            <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>Profile Information</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px" }}>
              <div>
                <label style={labelStyle}>Email Address (Read-only)</label>
                <input type="email" value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
              </div>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Janaki Varma" style={inputStyle} />
              </div>
              {message.text && <p style={{ color: message.type === "error" ? "#ef4444" : "#10b981", fontSize: "14px", margin: 0 }}>{message.text}</p>}
              <button type="submit" disabled={isSaving} style={{ ...purpleButtonStyle, width: "fit-content", opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section style={{ ...cardStyle, border: "1px solid rgba(239, 68, 68, 0.25)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "8px", color: "#f87171" }}>Account Access</h2>
            <p style={{ color: "#9ca3af", marginBottom: "24px", fontSize: "14px" }}>Ready to end your study session?</p>
            <button onClick={handleLogout} style={logoutButtonStyle}>Log Out Securely</button>
          </section>
        </div>
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

// --- FIXED FULL WIDTH UTILITY LAYOUT CONFIGS ---
const contentContainer = { display: "flex", flexDirection: "column" as const, gap: "24px", width: "100%" };
const cardStyle = { backgroundColor: "rgba(17,24,39,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "32px", width: "100%" } as const;

const labelStyle = { display: "block", marginBottom: "8px", color: "#9ca3af", fontSize: "14px" } as const;
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#111827", color: "white", outline: "none", fontSize: "15px" } as const;
const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: "600", cursor: "pointer" } as const;
const logoutButtonStyle = { backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" } as const;
const profileStyle = { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", color: "#9ca3af", fontSize: "13px" } as const;