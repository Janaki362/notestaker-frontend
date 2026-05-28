"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      await signInWithPopup(auth, googleProvider);
      router.push("/upload");
    } catch (error) {
      console.error("Google signup failed:", error);
      setErrorMessage("Google signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const completeName = `${firstName.trim()} ${lastName.trim()}`;
      await updateProfile(result.user, {
        displayName: completeName,
      });

      router.push("/upload");
    } catch (error) {
      console.error("Email signup failed:", error);
      setErrorMessage("Could not create account. Email may already be in use.");
      setIsLoading(false);
    }
  };

  return (
    <main style={pageWrapperStyle}>
      {/* Top Header Layer to match Landing Page Navigation */}
      <header style={headerStyle}>
        <div style={{ fontSize: "15px", fontWeight: "bold", letterSpacing: "0.5px" }}>
          NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "24px", fontSize: "13px", color: "#9ca3af", alignItems: "center" }}>
          <Link href="/#features" style={headerLinkStyle}>Product</Link>
          <Link href="/#features" style={headerLinkStyle}>Docs</Link>
          <Link href="/#pricing" style={headerLinkStyle}>Pricing</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
          <Link href="/login" style={headerLinkStyle}>Log In</Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={topSignUpButtonStyle}>Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Centered Content Card Area */}
      <section style={cardSectionStyle}>
        <div style={cardFormWrapperStyle}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "600", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>Sign Up</h1>
            <p style={{ color: "#71717a", fontSize: "14px", margin: 0 }}>Create notes in minutes. No credit card required.</p>
          </div>

          {errorMessage && (
            <div style={errorContainerStyle}>
              {errorMessage}
            </div>
          )}

          {/* Google Authentication Entry */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            style={{ ...socialButtonStyle, marginBottom: "24px" }}
          >
            <span style={socialIconWrapperStyle}>G</span>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={dividerStyle} />
            <span style={{ color: "#3f3f46", fontSize: "12px", fontWeight: "600" }}>OR</span>
            <div style={dividerStyle} />
          </div>

          {/* Form Ingestion Grid */}
          <form onSubmit={handleEmailSignup}>
            <div style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First name</label>
                <input
                  type="text"
                  placeholder="Sarthak"
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last name</label>
                <input
                  type="text"
                  placeholder="Dhawan"
                  style={inputStyle}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="sarthak@example.com"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={submitButtonStyle}
            >
              {isLoading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          <p style={bottomRedirectTextStyle}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "white", textDecoration: "underline" }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Fine Print Legal Footer Layer */}
      <footer style={footerStyle}>
        By creating or entering an account, you agree to the{" "}
        <Link href="#" style={footerLinkStyle}>Terms of Service</Link> and{" "}
        <Link href="#" style={footerLinkStyle}>Privacy Policy</Link>.
      </footer>
    </main>
  );
}

// --- Style Settings Mapping ---
const pageWrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  backgroundColor: "#09090b",
  color: "white",
  fontFamily: "'Urbanist', sans-serif"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 64px",
  backgroundColor: "transparent",
  borderBottom: "1px solid rgba(255,255,255,0.02)"
};

const headerLinkStyle = {
  color: "#a1a1aa",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "500"
};

const topSignUpButtonStyle = {
  backgroundColor: "#8b5cf6",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer"
};

const cardSectionStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px"
};

const cardFormWrapperStyle = {
  width: "100%",
  maxWidth: "440px",
  backgroundColor: "rgba(9,9,11,0.6)",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: "16px",
  padding: "36px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
};

const socialButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#18181b",
  color: "#e4e4e7",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.05)",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s"
};

const socialIconWrapperStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  backgroundColor: "white",
  color: "black",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "11px"
};

const dividerStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "rgba(255,255,255,0.04)"
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.08)",
  backgroundColor: "#09090b",
  color: "white",
  fontSize: "14px",
  outline: "none"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#a1a1aa",
  fontSize: "12px",
  fontWeight: "500"
};

const submitButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#8b5cf6",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  transition: "opacity 0.2s"
};

const errorContainerStyle = {
  color: "#ef4444",
  removeAttribute: true,
  marginBottom: "16px",
  fontSize: "13px",
  padding: "10px",
  backgroundColor: "rgba(239, 68, 68, 0.06)",
  borderRadius: "6px",
  border: "1px solid rgba(239, 68, 68, 0.15)",
  textAlign: "center" as const
};

const bottomRedirectTextStyle = {
  textAlign: "center" as const,
  marginTop: "24px",
  color: "#71717a",
  fontSize: "13px",
  marginBottom: 0
};

const footerStyle = {
  padding: "24px",
  textAlign: "center" as const,
  color: "#3f3f46",
  fontSize: "11px",
  borderTop: "1px solid rgba(255,255,255,0.01)"
};

const footerLinkStyle = {
  color: "#71717a",
  textDecoration: "underline"
};