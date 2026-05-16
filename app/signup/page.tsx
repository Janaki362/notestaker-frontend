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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      await signInWithPopup(auth, googleProvider);
      router.push("/upload");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Google signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, {
        displayName: fullName,
      });

      router.push("/upload");
    } catch (error) {
      console.error("Email signup failed:", error);
      setErrorMessage("Could not create account. Email may already be in use.");
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(to bottom right, #050816, #0b1023)",
        color: "white",
      }}
    >
      {/* Left Marketing Section */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div style={{ maxWidth: "520px" }}>
          <h1 style={{ fontSize: "48px", lineHeight: "1.2", marginBottom: "20px" }}>
            Create Your AI Study Workspace
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "18px", lineHeight: "1.7" }}>
            Upload notes, generate AI-powered summaries, flashcards, and quizzes
            to make studying smarter and faster.
          </p>
        </div>
      </section>

      {/* Right Signup Section */}
      <section
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          marginRight: "4vw", // Added right margin to let it breathe
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "rgba(17,24,39,0.92)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <h2 style={{ margin: 0 }}>Sign Up</h2>
            {/* Keeping the top right toggle for a modern feel */}
            <Link
              href="/login"
              style={{
                color: "#a78bfa",
                textDecoration: "none",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Login
            </Link>
          </div>

          {errorMessage && (
            <div 
              style={{ 
                color: "#ef4444", 
                marginBottom: "16px", 
                fontSize: "14px",
                padding: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "14px",
              backgroundColor: "#1f2937",
              color: "white",
              borderRadius: "12px",
              border: "1px solid #374151",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "600",
              marginBottom: "18px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "white",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              G
            </span>
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div style={dividerStyle} />
            <span style={{ color: "#9ca3af", fontSize: "13px" }}>OR</span>
            <div style={dividerStyle} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup}>
            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                style={inputStyle}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
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

            <div style={{ marginBottom: "24px", position: "relative" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  style={{ ...inputStyle, paddingRight: "50px" }} // Room for toggle
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(to right, #7c3aed, #9333ea)",
                color: "white",
                fontWeight: "700",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "15px",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Restored Bottom Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#a78bfa",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box", // ensures padding doesn't overflow width
} as const;

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#d1d5db",
  fontSize: "14px",
} as const;

const dividerStyle = {
  flex: 1,
  height: "1px",
  backgroundColor: "#374151",
} as const;