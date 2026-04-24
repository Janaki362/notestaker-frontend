import Link from "next/link";

export default function Home() {
  const buttonStyle = {
    padding: "12px 22px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  } as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "12px" }}>AI Study Platform</h1>
        <p style={{ color: "#555", marginBottom: "30px", fontSize: "18px" }}>
          Upload your document and get summaries, flashcards, and quizzes.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/login">
            <button style={buttonStyle}>Login</button>
          </Link>

          <Link href="/upload">
            <button style={buttonStyle}>Upload</button>
          </Link>

          <Link href="/results">
            <button style={buttonStyle}>Results</button>
          </Link>
        </div>
      </div>
    </main>
  );
}