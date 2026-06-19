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
          <h1 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#111827", fontWeight: "800", letterSpacing: "-0.5px" }}>Settings</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "15px" }}>Manage your account preferences and view your plan.</p>
        </div>

        <div style={contentContainer}>
          {/* Profile Information Section */}
          <section style={cardStyle}>
            <h2 style={{ fontSize: "20px", marginBottom: "24px", color: "#111827", fontWeight: "700" }}>Profile Information</h2>
            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "420px" }}>
              <div>
                <label style={labelStyle}>Email Address (Read-only)</label>
                <input 
                  type="email" 
                  value={user.email || ""} 
                  disabled 
                  style={{ ...inputStyle, backgroundColor: "#f9fafb", color: "#9ca3af", cursor: "not-allowed" }} 
                />
              </div>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="e.g. Janaki Varma" 
                  style={inputStyle} 
                />
              </div>
              {message.text && (
                <div style={{ 
                  padding: "12px", 
                  borderRadius: "8px", 
                  backgroundColor: message.type === "error" ? "#fef2f2" : "#ecfdf5",
                  border: `1px solid ${message.type === "error" ? "#fecaca" : "#a7f3d0"}`
                }}>
                  <p style={{ color: message.type === "error" ? "#dc2626" : "#059669", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {message.text}
                  </p>
                </div>
              )}
              <button type="submit" disabled={isSaving} style={{ ...primaryButtonStyle, width: "fit-content", opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          {/* NEW: Updated Subscription & Pricing Tiers */}
          <section style={{ ...cardStyle, padding: "32px 0", backgroundColor: "transparent", border: "none", boxShadow: "none" }}>
            <h2 style={{ fontSize: "20px", color: "#111827", fontWeight: "700", margin: "0 0 8px 0" }}>Subscription Plan</h2>
            <p style={{ color: "#6b7280", margin: "0 0 24px 0", fontSize: "14px" }}>Select the plan that fits your domain. Upgrade anytime as your needs grow.</p>
            
            <div style={pricingCardsContainer}>
              {/* Free / Student Tier */}
              <div style={pricingCardStyle}>
                <h3 style={tierNameStyle}>Basic</h3>
                <div style={priceContainer}>
                  <span style={priceStyle}>$0</span><span style={billingCycleStyle}>/mo</span>
                </div>
                <p style={descriptionStyle}>Perfect for students and casual learners.</p>
                <ul style={featureListStyle}>
                  <li style={featureItemStyle}>✓ <b>Student Mode</b> Only</li>
                  <li style={featureItemStyle}>✓ Flashcards & Quizzes</li>
                  <li style={featureItemStyle}>✓ 25 Uploads / month</li>
                </ul>
                <button style={{ ...outlineButtonStyle, cursor: "default", backgroundColor: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }}>✓ Active Plan</button>
              </div>

              {/* Pro Tier */}
              <div style={{ ...pricingCardStyle, ...proCardStyle }}>
                <div style={popularBadge}>Most Popular</div>
                <h3 style={{ ...tierNameStyle, color: "#2563eb" }}>Pro</h3>
                <div style={priceContainer}>
                  <span style={priceStyle}>$15</span><span style={billingCycleStyle}>/mo</span>
                </div>
                <p style={descriptionStyle}>For professionals managing meetings and documents.</p>
                <ul style={featureListStyle}>
                  <li style={{ ...featureItemStyle, marginBottom: "4px" }}>✓ <b>All Professional Modes</b></li>
                  <li style={{ fontSize: "12px", color: "#6b7280", paddingLeft: "20px", marginBottom: "12px" }}>(Legal, Medical & Business)</li>
                  <li style={featureItemStyle}>✓ Action Items Extraction</li>
                  <li style={featureItemStyle}>✓ 500 Uploads / month</li>
                </ul>
                <button style={upgradeButtonStyle}>Upgrade to Pro</button>
              </div>

              {/* Enterprise Tier */}
              <div style={pricingCardStyle}>
                <h3 style={tierNameStyle}>Enterprise</h3>
                <div style={priceContainer}>
                  <span style={priceStyle}>$99</span><span style={billingCycleStyle}>/mo</span>
                </div>
                <p style={descriptionStyle}>For law firms and heavy enterprise users.</p>
                <ul style={featureListStyle}>
                  <li style={featureItemStyle}>✓ <b>All Modes Unlocked</b></li>
                  <li style={featureItemStyle}>✓ <b>Model Armor</b> (PII Redaction)</li>
                  <li style={featureItemStyle}>✓ HIPAA/Legal Compliance</li>
                  <li style={featureItemStyle}>✓ Unlimited Uploads</li>
                </ul>
                <button style={outlineButtonStyle}>Contact Sales</button>
              </div>
            </div>
          </section>

          {/* Account Access & Logout Section */}
          <section style={{ ...cardStyle, border: "1px solid #fecaca", backgroundColor: "#fffbfb" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "8px", color: "#dc2626", fontWeight: "700" }}>Account Access</h2>
            <p style={{ color: "#7f1d1d", marginBottom: "24px", fontSize: "14px", fontWeight: "500" }}>Ready to end your study session securely?</p>
            <button onClick={handleLogout} style={logoutButtonStyle}>Log Out Securely</button>
          </section>
        </div>
      </section>
    </main>
  );
}

// --- Light Mode Sidebar Component ---
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
      <h2 style={{ margin: "0 0 24px", fontSize: "18px", color: "#111827", fontWeight: "700", letterSpacing: "-0.5px" }}>
        <span style={{ color: "#2563eb", marginRight: "6px" }}>✦</span>NotesTaker AI
      </h2>
      <Link href="/upload" style={{ textDecoration: "none" }}><button style={{ ...primaryButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button></Link>
      <nav style={navStyle}>
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
      <div style={{ ...profileStyle, marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111827", fontWeight: "600", fontSize: "14px", margin: 0 }}>
          <span style={{ backgroundColor: "#e5e7eb", borderRadius: "50%", padding: "4px" }}>👤</span> {userName}
        </div>
        <p style={{ margin: "4px 0 0 32px", fontSize: "12px", color: "#6b7280" }}>AI Study Workspace</p>
      </div>
    </div>
  );
}

// --- Enterprise Light Mode Design Tokens ---
const pageStyle = { minHeight: "100vh", display: "flex", backgroundColor: "#ffffff", color: "#111827", fontFamily: "'Urbanist', 'Inter', sans-serif" } as const;
const sidebarStyle = { width: "260px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "24px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "48px 64px", overflowY: "auto", backgroundColor: "#ffffff" } as const;

// --- FULL WIDTH UTILITY LAYOUT CONFIGS ---
const contentContainer = { display: "flex", flexDirection: "column" as const, gap: "24px", width: "100%", maxWidth: "950px" };
const cardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "32px", width: "100%", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" } as const;

const labelStyle = { display: "block", marginBottom: "8px", color: "#374151", fontSize: "14px", fontWeight: "600" } as const;
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", outline: "none", fontSize: "15px", transition: "border-color 0.2s" } as const;
const primaryButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 24px", fontWeight: "600", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", transition: "background-color 0.2s" } as const;
const logoutButtonStyle = { backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 20px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" } as const;
const profileStyle = { borderTop: "1px solid #e5e7eb", paddingTop: "20px" } as const;

// --- PRICING SPECIFIC STYLES ---
const pricingCardsContainer = { display: "flex", gap: "20px", flexWrap: "wrap" as const };
const pricingCardStyle = { flex: "1 1 250px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" as const, position: "relative" as const, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" };
const proCardStyle = { borderColor: "#2563eb", boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.15)", transform: "scale(1.02)" };
const popularBadge = { position: "absolute" as const, top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#2563eb", color: "#ffffff", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "999px", textTransform: "uppercase" as const };
const tierNameStyle = { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 12px 0" };
const priceContainer = { display: "flex", alignItems: "baseline", marginBottom: "12px" };
const priceStyle = { fontSize: "32px", fontWeight: "800", color: "#111827" };
const billingCycleStyle = { fontSize: "14px", color: "#6b7280", marginLeft: "4px" };
const descriptionStyle = { fontSize: "13px", color: "#6b7280", marginBottom: "20px", minHeight: "36px" };
const featureListStyle = { listStyle: "none", padding: 0, margin: "0 0 24px 0", flexGrow: 1 };
const featureItemStyle = { fontSize: "13px", color: "#374151", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" };
const outlineButtonStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "transparent", color: "#374151", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" };
const upgradeButtonStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" };