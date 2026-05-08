"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
        })
      );

      router.push("/upload");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom right, #050816, #0b1023)",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          fontSize: "14px",
        }}
      >
        <h3 style={{ margin: 0 }}>NotesTaker AI</h3>

        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <span>Product</span>
          <span>Docs</span>
          <span>Pricing</span>

          <button
            style={{
              backgroundColor: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

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
        <h1
          style={{
            marginBottom: "8px",
            fontSize: "34px",
          }}
        >
          Sign In
        </h1>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "28px",
            fontSize: "15px",
          }}
        >
          Continue to AI Study Platform
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
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
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "15px",
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
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#374151",
            }}
          />

          <span style={{ margin: "0 12px" }}>OR</span>

          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#374151",
            }}
          />
        </div>

        {/* Fake Inputs for UI Match */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            placeholder="Email"
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            style={inputStyle}
          />

          <button
            style={{
              marginTop: "10px",
              background:
                "linear-gradient(to right, #7c3aed, #9333ea)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create an account
          </button>
        </div>

        <p
          style={{
            marginTop: "24px",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          Already have an account? Sign in
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
} as const;