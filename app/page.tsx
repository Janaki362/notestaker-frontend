"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#a78bfa" }}>✦</span> NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "white"} onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}>
            Log in
          </Link>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button style={purpleButtonStyle}>Get Started Free</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", backgroundColor: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.25)", color: "#d8b4fe", fontSize: "13px", fontWeight: "500", marginBottom: "24px", letterSpacing: "0.5px" }}>
          ✨ Powered by Advanced AI
        </div>
        
        <h1 style={{ fontSize: "58px", lineHeight: "1.1", margin: "0 0 20px 0", letterSpacing: "-1.5px", fontWeight: "800" }}>
          Turn any lecture into <br />
          <span style={{ color: "#a78bfa" }}>perfect study notes.</span>
        </h1>
        
        <p style={{ fontSize: "18px", color: "#9ca3af", maxWidth: "580px", margin: "0 auto 36px auto", lineHeight: "1.6" }}>
          Upload a PDF. Get comprehensive summaries, interactive flashcards, and practice quizzes instantly.
        </p>
        
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "64px" }}>
          <Link href="/upload" style={{ textDecoration: "none" }}>
            <button style={{ ...purpleButtonStyle, padding: "14px 28px", fontSize: "15px" }}>
              Try it Now — Free →
            </button>
          </Link>
          <Link href="#features" style={{ textDecoration: "none" }}>
            <button style={secondaryButtonStyle}>
              See how it works
            </button>
          </Link>
        </div>

        {/* --- NEW: Interactive Product Mockup / Preview Window --- */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#eab308" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22c55e" }}></div>
            </div>
            <span style={{ fontSize: "11px", color: "#4b5563", letterSpacing: "0.5px" }}>WORKSPACE PREVIEW</span>
          </div>
          <div style={mockupBodyStyle}>
            <div style={{ textAlign: "left", opacity: 0.85 }}>
              <p style={{ color: "#8b5cf6", fontSize: "11px", margin: "0 0 4px 0", fontWeight: "600" }}>Notes Editor</p>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: "700" }}>AI Generated Study Notes</h3>
              <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "14px" }}>
                <span style={{ color: "#c4b5fd", fontWeight: "bold", fontSize: "13px" }}>Summary:</span>
                <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#9ca3af", lineHeight: "1.5" }}>This document introduces the fundamental concepts of cloud security, defining it as the process of protecting data, applications, and infrastructure within a cloud network environment...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={featuresSectionStyle}>
        <h2 style={{ textAlign: "center", fontSize: "32px", marginBottom: "48px", fontWeight: "700", letterSpacing: "-0.5px" }}>Everything you need to study smarter.</h2>
        <div style={gridStyle}>
          
          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>📝</div>
            <h3 style={{ fontSize: "19px", marginBottom: "12px", fontWeight: "600" }}>Instant Summaries</h3>
            <p style={{ color: "#9ca3af", margin: 0, lineHeight: "1.6", fontSize: "14px" }}>Stop re-reading entire chapters. Get the key concepts, definitions, and examples extracted instantly.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>▱</div>
            <h3 style={{ fontSize: "19px", marginBottom: "12px", fontWeight: "600" }}>Smart Flashcards</h3>
            <p style={{ color: "#9ca3af", margin: 0, lineHeight: "1.6", fontSize: "14px" }}>Master vocabulary and core concepts with auto-generated, interactive flashcards ready for review.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>▣</div>
            <h3 style={{ fontSize: "19px", marginBottom: "12px", fontWeight: "600" }}>Practice Quizzes</h3>
            <p style={{ color: "#9ca3af", margin: 0, lineHeight: "1.6", fontSize: "14px" }}>Test your knowledge before the real exam with AI-crafted multiple choice questions and instant feedback.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ color: "#4b5563", fontSize: "13px" }}>
          © 2026 NotesTaker AI. Built for modern learning.
        </div>
      </footer>
    </main>
  );
}

// --- Styles ---
const pageStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(to bottom right, #040612, #0b0f24)", color: "white" } as const;

const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.04)" } as const;

const heroStyle = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 24px 0 24px", maxWidth: "1000px", margin: "0 auto" } as const;

// Mockup Graphic CSS
const mockupContainerStyle = { width: "100%", maxWidth: "640px", backgroundColor: "#0b0e17", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px 12px 0 0", borderBottom: "none", padding: "12px", boxShadow: "0 -20px 50px rgba(139, 92, 246, 0.12)" } as const;
const mockupHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "14px" } as const;
const mockupBodyStyle = { backgroundColor: "rgba(17,24,39,0.6)", borderRadius: "8px", padding: "20px", border: "1px solid rgba(255,255,255,0.03)" } as const;

const featuresSectionStyle = { padding: "90px 48px", backgroundColor: "rgba(8,11,23,0.6)", borderTop: "1px solid rgba(255,255,255,0.04)" } as const;

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", maxWidth: "1100px", margin: "0 auto" } as const;

const featureCardStyle = { backgroundColor: "rgba(17,24,39,0.45)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "28px", cursor: "default" } as const;

const iconBoxStyle = { width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "20px" } as const;

const footerStyle = { padding: "28px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.03)" } as const;

const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 20px", fontWeight: "600", cursor: "pointer" } as const;

// Updated Soft Gray Ghost Button Style
const secondaryButtonStyle = { backgroundColor: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" } as const;