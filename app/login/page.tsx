"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // handles both errors and success messages

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setMessage({ text: "", type: "" });
      await signInWithPopup(auth, googleProvider);
      router.push("/upload");
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({ text: "Google login failed. Please try again.", type: "error" });
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: "Please enter both email and password.", type: "error" });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ text: "", type: "" });
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/upload");
    } catch (error) {
      console.error("Email login failed:", error);
      setMessage({ text: "Invalid email or password.", type: "error" });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ text: "Please enter your email address above first.", type: "error" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ text: "Password reset email sent! Check your inbox.", type: "success" });
    } catch (error) {
      console.error("Reset failed:", error);
      setMessage({ text: "Failed to send reset email. Ensure your email is correct.", type: "error" });
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #050816, #0b1023)",
        padding: "20px",
      }}
    >
      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "rgba(17, 24, 39, 0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "8px", fontSize: "34px" }}>Sign In</h1>
        <p style={{ color: "#9ca3af", marginBottom: "28px", fontSize: "15px" }}>
          Continue to AI Study Platform
        </p>

        {message.text && (
          <div 
            style={{ 
              color: message.type === "error" ? "#ef4444" : "#10b981", 
              marginBottom: "16px", 
              fontSize: "14px",
              padding: "10px",
              backgroundColor: message.type === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
              borderRadius: "8px",
              border: `1px solid ${message.type === "error" ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)"}`
            }}
          >
            {message.text}
          </div>
        )}

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "14px 18px",
            backgroundColor: "#1f2937",
            color: "white",
            borderRadius: "10px",
            border: "1px solid #374151",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "500",
            fontSize: "15px",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
            }}
          >
            G
          </span>
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "28px 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#374151" }} />
          <span style={{ margin: "0 12px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#374151" }} />
        </div>

        {/* Email/Password Form */}
        <form
          onSubmit={handleEmailLogin}
          style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            {/* Forgot Password Link */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a78bfa",
                  fontSize: "13px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: "10px",
              width: "100%",
              background: "linear-gradient(to right, #7c3aed, #9333ea)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "24px", color: "#9ca3af", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#a78bfa", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "white",
  outline: "none",
  boxSizing: "border-box", // ensures padding doesn't overflow width
} as const;