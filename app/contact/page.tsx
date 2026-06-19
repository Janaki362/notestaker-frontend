"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Pulling in your database connection

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("sending");

    try {
      // Sends the message to a new "contactMessages" collection in your Firestore
      await addDoc(collection(db, "contactMessages"), {
        name: name,
        email: email,
        message: message,
        createdAt: serverTimestamp(),
      });
      
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <main style={pageWrapperStyle}>
      {/* Shared Header */}
      <header style={headerStyle}>
        <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "0.5px", color: "#111827" }}>
          NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "#6b7280", alignItems: "center" }}>
          <Link href="/#features" style={headerLinkStyle}>Product</Link>
          <Link href="/about" style={headerLinkStyle}>About</Link>
          <Link href="/contact" style={{...headerLinkStyle, color: "#111827", fontWeight: "600"}}>Contact</Link>
          <Link href="/#pricing" style={headerLinkStyle}>Pricing</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
          <Link href="/login" style={headerLinkStyle}>Log In</Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={topSignUpButtonStyle}>Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Contact Content */}
      <section style={contentSectionStyle}>
        <div style={{ width: "100%", maxWidth: "480px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "40px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", marginBottom: "8px", letterSpacing: "-0.5px" }}>Get in Touch</h1>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "32px" }}>Have questions about our Alpha Launch? We'd love to hear from you.</p>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input 
                type="text" 
                placeholder="Your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea 
                placeholder="How can we help you?" 
                rows={4} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{...inputStyle, resize: "vertical"}}
              ></textarea>
            </div>
            
            {status === "success" && (
              <div style={{ color: "#059669", backgroundColor: "#ecfdf5", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textAlign: "center", border: "1px solid #a7f3d0" }}>
                Message sent successfully! We will be in touch soon.
              </div>
            )}
            
            {status === "error" && (
              <div style={{ color: "#dc2626", backgroundColor: "#fef2f2", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textAlign: "center", border: "1px solid #fecaca" }}>
                Failed to send message. Please try again.
              </div>
            )}

            <button type="submit" disabled={status === "sending"} style={{...submitButtonStyle, opacity: status === "sending" ? 0.7 : 1}}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* Shared Footer */}
      <footer style={footerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto", color: "#6b7280", fontSize: "13px", fontWeight: "500" }}>
          <div>© 2026 NotesTaker AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Swapped spans for actual Links */}
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
const contentSectionStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px", backgroundColor: "#fafafa" };
const footerStyle = { padding: "40px 64px", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" };

const labelStyle = { display: "block", marginBottom: "6px", color: "#4b5563", fontSize: "13px", fontWeight: "600" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px", outline: "none", fontFamily: "inherit" };
const submitButtonStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "14px", marginTop: "8px" };