import Link from "next/link";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link href="/">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Home
          </button>
        </Link>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>AI Study Platform</h1>
        <h2 style={{ marginBottom: "10px", fontSize: "22px" }}>Login</h2>
        <p style={{ color: "#555", marginBottom: "24px" }}>
          Sign in to continue
        </p>

        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "12px 18px",
            backgroundColor: "white",
            color: "black",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              fontWeight: "bold",
            }}
          >
            G
          </span>
          Sign in with Google
        </button>
      </div>
    </main>
  );
}