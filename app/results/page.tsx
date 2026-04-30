"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Flashcard = {
  question: string;
  answer: string;
};

type Definition = {
  term: string;
  meaning: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type AIResults = {
  summary: string;
  keyConcepts: string[];
  definitions: Definition[];
  examples: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

export default function ResultsPage() {
  const [results, setResults] = useState<AIResults | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("aiResults");

    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1>No Results Yet</h1>
          <p>Please upload a document first.</p>
          <Link href="/upload">
            <button
              style={{
                padding: "10px 16px",
                backgroundColor: "black",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go to Upload
            </button>
          </Link>
        </div>
      </main>
    );
  }

  const firstFlashcard = results.flashcards?.[0];
  const firstQuiz = results.quiz?.[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "30px 20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>AI Study Platform</h1>
        <h2 style={{ textAlign: "center" }}>Results</h2>

        <section style={cardStyle}>
          <h3>Summary</h3>
          <p>{results.summary}</p>
        </section>

        <section style={cardStyle}>
          <h3>Key Concepts</h3>
          <ul>
            {results.keyConcepts?.map((concept, index) => (
              <li key={index}>{concept}</li>
            ))}
          </ul>
        </section>

        <section style={cardStyle}>
          <h3>Definitions</h3>
          {results.definitions?.map((item, index) => (
            <p key={index}>
              <b>{item.term}:</b> {item.meaning}
            </p>
          ))}
        </section>

        <section style={cardStyle}>
          <h3>Examples</h3>
          <ul>
            {results.examples?.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </section>

        {firstFlashcard && (
          <section
            onClick={() => setShowAnswer(!showAnswer)}
            style={{ ...cardStyle, cursor: "pointer" }}
          >
            <h3>Flashcard</h3>
            {!showAnswer ? (
              <p>
                <b>Q:</b> {firstFlashcard.question}
              </p>
            ) : (
              <p>
                <b>A:</b> {firstFlashcard.answer}
              </p>
            )}
            <p style={{ color: "#666", fontSize: "14px" }}>
              Click card to flip
            </p>
          </section>
        )}

        {firstQuiz && (
          <section style={cardStyle}>
            <h3>Quiz</h3>
            <p>{firstQuiz.question}</p>

            <div>
              {firstQuiz.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  style={{
                    margin: "5px",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    backgroundColor:
                      selectedAnswer === option ? "#d1fae5" : "white",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedAnswer && (
              <p style={{ marginTop: "12px" }}>
                Selected Answer: <b>{selectedAnswer}</b>
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

const cardStyle = {
  margin: "20px auto",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
} as const;