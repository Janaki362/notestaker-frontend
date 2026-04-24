"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResultsPage() {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const optionStyle = (option: string) =>
    ({
      margin: "5px",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      cursor: "pointer",
      backgroundColor: selectedAnswer === option ? "#d1fae5" : "white",
    }) as const;

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
          maxWidth: "700px",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>AI Study Platform</h1>
        <h2 style={{ marginBottom: "24px", fontSize: "22px" }}>Results</h2>

        <div
          style={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: "550px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Summary</h3>
          <p>
            This document explains key concepts of cloud security and networking.
          </p>
        </div>

        <div
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: "550px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <h3>Flashcards</h3>
          {!showAnswer ? (
            <p>
              <b>Q:</b> What is VPC?
            </p>
          ) : (
            <p>
              <b>A:</b> A virtual private cloud used for secure networking.
            </p>
          )}
          <p style={{ color: "#666", marginTop: "10px", fontSize: "14px" }}>
            Click card to flip
          </p>
        </div>

        <div
          style={{
            margin: "20px auto",
            padding: "20px",
            maxWidth: "550px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Quiz</h3>
          <p>Which service is used for identity management?</p>

          <div style={{ marginTop: "12px" }}>
            {["A) IAM", "B) VPC", "C) Load Balancer"].map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                style={optionStyle(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}