"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={pageWrapperStyle}>
      {/* Shared Header */}
      <header style={headerStyle}>
        <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "-0.5px", color: "#111827" }}>
          ✦ NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "#6b7280", alignItems: "center" }}>
          <Link href="/#features" style={headerLinkStyle}>Product</Link>
          <Link href="/about" style={{...headerLinkStyle, color: "#111827", fontWeight: "600"}}>About</Link>
          <Link href="/contact" style={headerLinkStyle}>Contact</Link>
          <Link href="/#pricing" style={headerLinkStyle}>Pricing</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
          <Link href="/login" style={headerLinkStyle}>Log In</Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={topSignUpButtonStyle}>Sign Up</button>
          </Link>
        </div>
      </header>

      {/* About Content */}
      <section style={contentSectionStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#111827", marginBottom: "32px", letterSpacing: "-0.5px" }}>About NotesTaker AI</h1>
          
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>Mission</h2>
          <p style={{ color: "#4b5563", marginBottom: "40px", lineHeight: "1.6", fontSize: "16px" }}>
            We are on a mission to transform chaotic, lengthy source material into structured knowledge. Our platform provides a high-fidelity workspace designed for deep focus and intellectual mastery, empowering learners and professionals to synthesize complex information in minutes.
          </p>

          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>Core Features</h2>
          <ul style={{ color: "#4b5563", lineHeight: "2.2", listStyle: "none", padding: 0, fontSize: "16px" }}>
            <li>✅ <strong>AI Notes Generation:</strong> Instant structured summaries.</li>
            <li>✅ <strong>Interactive Flashcards:</strong> Automated retention tools.</li>
            <li>✅ <strong>Automated Quizzes:</strong> Test your knowledge automatically.</li>
            <li>✅ <strong>AI Chat Interface:</strong> Converse directly with your documents.</li>
            <li>✅ <strong>Secure Cloud Storage:</strong> Enterprise-grade data protection.</li>
          </ul>
        </div>
      </section>

      {/* Shared Footer */}
      <footer style={footerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto", color: "#6b7280", fontSize: "13px", fontWeight: "500" }}>
          <div>© 2026 NotesTaker AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>TERMS</Link>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>PRIVACY POLICY</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Light Mode Design Tokens ---
const pageWrapperStyle = { minHeight: "100vh", display: "flex", flexDirection: "column" as const, backgroundColor: "#ffffff", fontFamily: "'Urbanist', 'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 64px", backgroundColor: "#ffffff", borderBottom: "1px solid #f3f4f6" };
const headerLinkStyle = { color: "#4b5563", textDecoration: "none", fontSize: "13px", fontWeight: "500" };
const topSignUpButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
const contentSectionStyle = { flex: 1, padding: "64px 24px", backgroundColor: "#fafafa" };
const footerStyle = { padding: "40px 64px", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" };