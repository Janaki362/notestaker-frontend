"use client";

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
      <main style={pageStyle}>
        <aside style={sidebarStyle}>
          <Sidebar />
        </aside>

        <section style={mainStyle}>
          <div style={emptyCardStyle}>
            <h1>No Results Yet</h1>
            <p style={{ color: "#9ca3af" }}>Please upload a document first.</p>
            <button
              onClick={() => (window.location.href = "/upload")}
              style={purpleButtonStyle}
            >
              Go to Upload
            </button>
          </div>
        </section>
      </main>
    );
  }

  const firstFlashcard = results.flashcards?.[0];
  const firstQuiz = results.quiz?.[0];

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}>
        <Sidebar />
      </aside>

      <section style={mainStyle}>
        <header style={topBarStyle}>
          <div>
            <p style={{ color: "#9ca3af", margin: 0 }}>Notes Editor</p>
            <h1 style={{ margin: "6px 0 0", fontSize: "28px" }}>
              AI Generated Study Notes
            </h1>
          </div>

          <button style={purpleButtonStyle}>Saved</button>
        </header>

        <div style={contentGridStyle}>
          <div style={notesPanelStyle}>
            <div style={tabsStyle}>
              <span style={activeTabStyle}>Notes</span>
              <span>Flashcards</span>
              <span>Quiz</span>
            </div>

            <section style={resultCardStyle}>
              <h2>Summary</h2>
              <p style={paragraphStyle}>{results.summary}</p>
            </section>

            <section style={resultCardStyle}>
              <h2>Key Concepts</h2>
              <ul style={listStyle}>
                {results.keyConcepts?.map((concept, index) => (
                  <li key={index}>{concept}</li>
                ))}
              </ul>
            </section>

            <section style={resultCardStyle}>
              <h2>Definitions</h2>
              {results.definitions?.map((item, index) => (
                <p key={index} style={paragraphStyle}>
                  <b style={{ color: "#c4b5fd" }}>{item.term}:</b>{" "}
                  {item.meaning}
                </p>
              ))}
            </section>

            <section style={resultCardStyle}>
              <h2>Examples</h2>
              <ul style={listStyle}>
                {results.examples?.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </section>
          </div>

          <div style={studyPanelStyle}>
            {firstFlashcard && (
              <section
                onClick={() => setShowAnswer(!showAnswer)}
                style={flashcardStyle}
              >
                <p style={{ color: "#a78bfa", fontSize: "12px" }}>
                  FLASHCARD
                </p>

                {!showAnswer ? (
                  <h2>{firstFlashcard.question}</h2>
                ) : (
                  <p style={paragraphStyle}>{firstFlashcard.answer}</p>
                )}

                <p style={{ color: "#6b7280", fontSize: "13px" }}>
                  Click card to flip
                </p>
              </section>
            )}

            {firstQuiz && (
              <section style={quizCardStyle}>
                <h2>Quiz</h2>
                <p style={paragraphStyle}>{firstQuiz.question}</p>

                <div style={{ display: "grid", gap: "12px" }}>
                  {firstQuiz.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedAnswer(option)}
                      style={{
                        ...quizOptionStyle,
                        border:
                          selectedAnswer === option
                            ? option === firstQuiz.answer
                              ? "1px solid #22c55e"
                              : "1px solid #ef4444"
                            : "1px solid #374151",
                        backgroundColor:
                          selectedAnswer === option
                            ? option === firstQuiz.answer
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(239,68,68,0.15)"
                            : "#111827",
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {selectedAnswer && (
                  <p
                    style={{
                      marginTop: "16px",
                      color:
                        selectedAnswer === firstQuiz.answer
                          ? "#22c55e"
                          : "#f87171",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedAnswer === firstQuiz.answer
                      ? "Correct!"
                      : `Incorrect. Correct answer is: ${firstQuiz.answer}`}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Sidebar() {
  return (
    <>
      <div>
        <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>
          ✦ NotesTaker AI
        </h2>

        <button
          onClick={() => (window.location.href = "/upload")}
          style={purpleButtonStyle}
        >
          + New Study Set
        </button>

        <nav style={navStyle}>
          <span>▦ Dashboard</span>
          <span>📝 Notes</span>
          <span>▱ Flashcards</span>
          <span>▣ Quizzes</span>
          <span>📁 Folders</span>
          <span>⚙ Settings</span>
        </nav>
      </div>

      <div style={profileStyle}>
        <p style={{ margin: 0 }}>👤 Janaki</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
          AI Study Workspace
        </p>
      </div>
    </>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  background: "linear-gradient(to bottom right, #050816, #0b1023)",
  color: "white",
} as const;

const sidebarStyle = {
  width: "250px",
  backgroundColor: "#11131a",
  borderRight: "1px solid rgba(255,255,255,0.08)",
  padding: "24px 18px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
} as const;

const mainStyle = {
  flex: 1,
  padding: "32px",
} as const;

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
} as const;

const contentGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: "24px",
} as const;

const notesPanelStyle = {
  backgroundColor: "rgba(17,24,39,0.75)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "24px",
} as const;

const studyPanelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
} as const;

const tabsStyle = {
  display: "flex",
  gap: "24px",
  color: "#9ca3af",
  borderBottom: "1px solid #374151",
  paddingBottom: "14px",
  marginBottom: "20px",
} as const;

const activeTabStyle = {
  color: "#c4b5fd",
  borderBottom: "2px solid #8b5cf6",
  paddingBottom: "14px",
} as const;

const resultCardStyle = {
  backgroundColor: "rgba(31,41,55,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "18px",
} as const;

const flashcardStyle = {
  background:
    "linear-gradient(to bottom right, rgba(31,41,55,0.95), rgba(17,24,39,0.95))",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "18px",
  padding: "34px",
  minHeight: "220px",
  textAlign: "center",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
} as const;

const quizCardStyle = {
  backgroundColor: "rgba(17,24,39,0.85)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "24px",
} as const;

const quizOptionStyle = {
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "left",
} as const;

const paragraphStyle = {
  color: "#d1d5db",
  lineHeight: "1.7",
} as const;

const listStyle = {
  color: "#d1d5db",
  lineHeight: "1.8",
} as const;

const purpleButtonStyle = {
  backgroundColor: "#8b5cf6",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 16px",
  fontWeight: "600",
  cursor: "pointer",
} as const;

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  color: "#cbd5e1",
  fontSize: "14px",
  marginTop: "24px",
} as const;

const profileStyle = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  paddingTop: "16px",
  color: "#9ca3af",
  fontSize: "13px",
} as const;

const emptyCardStyle = {
  maxWidth: "420px",
  margin: "120px auto",
  backgroundColor: "rgba(17,24,39,0.85)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "32px",
  textAlign: "center",
} as const;