"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      await signInWithPopup(auth, googleProvider);
      router.push("/upload");
    } catch (error) {
      console.error("Google authentication failed:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/upload");
    } catch (error) {
      console.error("Email sign-in failed:", error);
      setErrorMessage("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address first so we know where to send the link.");
      setSuccessMessage("");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Password reset failed:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No account exists with this email address.");
      } else {
        setErrorMessage("Could not send reset email. Please verify the email format.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={pageWrapperStyle}>
      {/* Top Header Layer */}
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
          <Link href="/login" style={{...headerLinkStyle, color: "#111827", fontWeight: "600"}}>Log In</Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={topSignUpButtonStyle}>Sign Up</button>
          </Link>
        </div>
      </header>

      {/* Centered Content Card Area */}
      <section style={cardSectionStyle}>
        <div style={cardFormWrapperStyle}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", letterSpacing: "-0.5px", color: "#111827" }}>Sign In</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>Continue to AI Study Platform</p>
          </div>

          {errorMessage && (
            <div style={errorContainerStyle}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={successContainerStyle}>
              {successMessage}
            </div>
          )}

          {/* Core Google Sign In Action Block */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{ ...socialButtonStyle, marginBottom: "24px" }}
          >
            <span style={socialIconWrapperStyle}>G</span>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={dividerStyle} />
            <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600" }}>OR</span>
            <div style={dividerStyle} />
          </div>

          {/* Form Action Layer */}
          <form onSubmit={handleEmailSignIn}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isLoading}
              />
            </div>

            <div style={{ textAlign: "right", marginBottom: "28px" }}>
              <button 
                type="button" 
                onClick={handleForgotPassword} 
                style={forgotPasswordButtonStyle}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={submitButtonStyle}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={bottomRedirectTextStyle}>
            Don't have an account?{" "}
            <Link href="/signup" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: "600" }}>
              Sign up
            </Link>
          </p>
        </div>
      </section>

      {/* Legal Sub-Footer Fine Print */}
      <footer style={footerStyle}>
        By creating or entering an account, you agree to the{" "}
        <Link href="/terms" style={footerLinkStyle}>Terms of Service</Link> and{" "}
        <Link href="/privacy" style={footerLinkStyle}>Privacy Policy</Link>.
      </footer>
    </main>
  );
}

// --- Light Mode & Blue Design Tokens ---
const pageWrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  backgroundColor: "#ffffff", // Pure white background
  color: "#111827", // Dark text
  fontFamily: "'Urbanist', sans-serif"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "24px 64px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #f3f4f6" // Light gray border
};

const headerLinkStyle = {
  color: "#4b5563",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "500"
};

const topSignUpButtonStyle = {
  backgroundColor: "#2563eb", // Professional Blue
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
  padding: "40px 24px",
  backgroundColor: "#fafafa" // Very subtle off-white for the area behind the card
};

const cardFormWrapperStyle = {
  width: "100%",
  maxWidth: "440px",
  backgroundColor: "#ffffff", // White card
  border: "1px solid #e5e7eb", // Light gray border
  borderRadius: "16px",
  padding: "36px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)" // Soft, modern shadow
};

const socialButtonStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#ffffff",
  color: "#374151",
  borderRadius: "10px",
  border: "1px solid #d1d5db", // Gray outline for the Google button
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "background-color 0.2s"
};

const socialIconWrapperStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  backgroundColor: "#f3f4f6", // Light gray box for the 'G'
  color: "#111827",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "11px"
};

const dividerStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "#e5e7eb" // Light divider line
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db", // Gray border
  backgroundColor: "#f9fafb", // Very light gray background for input
  color: "#111827", // Dark text inside input
  fontSize: "14px",
  outline: "none"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#4b5563", // Medium gray label
  fontSize: "12px",
  fontWeight: "600"
};

const forgotPasswordButtonStyle = {
  background: "none",
  border: "none",
  color: "#2563eb", // Professional Blue
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  padding: 0,
  fontFamily: "inherit"
};

const submitButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb", // Professional Blue
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  transition: "opacity 0.2s"
};

const errorContainerStyle = {
  color: "#ef4444",
  marginBottom: "16px",
  fontSize: "13px",
  padding: "10px",
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  border: "1px solid #fecaca",
  textAlign: "center" as const
};

const successContainerStyle = {
  color: "#10b981",
  marginBottom: "16px",
  fontSize: "13px",
  padding: "10px",
  backgroundColor: "#ecfdf5",
  borderRadius: "6px",
  border: "1px solid #a7f3d0",
  textAlign: "center" as const
};

const bottomRedirectTextStyle = {
  textAlign: "center" as const,
  marginTop: "24px",
  color: "#6b7280",
  fontSize: "13px",
  marginBottom: 0
};

const footerStyle = {
  padding: "24px",
  textAlign: "center" as const,
  color: "#9ca3af",
  fontSize: "11px",
  borderTop: "1px solid #f3f4f6"
};

const footerLinkStyle = {
  color: "#6b7280",
  textDecoration: "underline"
};