"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={pageWrapperStyle}>
      <header style={headerStyle}>
        <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "0.5px", color: "#111827" }}>
          NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "#6b7280", alignItems: "center" }}>
          <Link href="/#features" style={headerLinkStyle}>Product</Link>
          <Link href="/about" style={headerLinkStyle}>About</Link>
          <Link href="/contact" style={headerLinkStyle}>Contact</Link>
          <Link href="/#pricing" style={headerLinkStyle}>Pricing</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
          <Link href="/login" style={headerLinkStyle}>Log In</Link>
          <Link href="/signup" style={{ textDecoration: "none" }}><button style={topSignUpButtonStyle}>Sign Up</button></Link>
        </div>
      </header>

      <section style={contentSectionStyle}>
        <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#ffffff", padding: "48px", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", marginBottom: "24px" }}>Privacy Policy</h1>
          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
            <strong>Data Security:</strong> We use industry-standard encryption and Google Firebase's secure multi-tenant architecture to ensure that your study materials remain completely private to your account.
          </p>
          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.7", marginBottom: "16px" }}>
            <strong>AI Processing:</strong> The documents you upload are temporarily sent to our secure backend pipeline to generate insights. They are not used to train global AI models.
          </p>
          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.7" }}>
            <strong>Contact Forms:</strong> When you submit a message via our Contact page, your name and email are stored securely in our database solely for the purpose of responding to your inquiry.
          </p>
        </div>
      </section>

      <footer style={footerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto", color: "#6b7280", fontSize: "13px", fontWeight: "500" }}>
          <div>© 2026 NotesTaker AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>TERMS</Link>
            <Link href="/privacy" style={{ color: "#111827", textDecoration: "none", fontWeight: "600" }}>PRIVACY POLICY</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Styles ---
const pageWrapperStyle = { minHeight: "100vh", display: "flex", flexDirection: "column" as const, backgroundColor: "#ffffff", fontFamily: "'Urbanist', 'Inter', sans-serif" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 64px", backgroundColor: "#ffffff", borderBottom: "1px solid #f3f4f6" };
const headerLinkStyle = { color: "#4b5563", textDecoration: "none", fontSize: "13px", fontWeight: "500" };
const topSignUpButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
const contentSectionStyle = { flex: 1, padding: "64px 24px", backgroundColor: "#fafafa" };
const footerStyle = { padding: "40px 64px", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" };