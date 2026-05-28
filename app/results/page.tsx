"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"; 
import { auth, db } from "../firebase";

type Flashcard = { question: string; answer: string; };
type Definition = { term: string; meaning: string; };
type QuizQuestion = { question: string; options: string[]; answer: string; };
type AIResults = {
  summary: string;
  keyConcepts: string[];
  definitions: Definition[];
  examples: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

type ChatMessage = { role: "user" | "ai"; content: string };

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dbId = searchParams.get("id");

  const [results, setResults] = useState<AIResults | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Notes" | "Flashcards" | "Quiz">("Notes");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Flashcard State
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0); 
  const [isQuizFinished, setIsQuizFinished] = useState(false); // NEW: Controls the frosted glass score modal overlay

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hi! I've analyzed your notes. What would you like to know?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const loadData = async () => {
      if (dbId) {
        try {
          const docRef = doc(db, "studySets", dbId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fetchedData = docSnap.data();
            setResults(fetchedData.data);
            setFileName(fetchedData.fileName);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      } else {
        const storedResults = localStorage.getItem("aiResults");
        if (storedResults) setResults(JSON.parse(storedResults));

        const storedFile = localStorage.getItem("uploadedFile");
        if (storedFile) {
          const parsedFile = JSON.parse(storedFile);
          setFileName(parsedFile.name);
        }
      }
    };
    loadData();
  }, [dbId]);

  const handleSaveToCloud = async () => {
    if (!auth.currentUser || !results) {
      setSaveMessage("Error: Please log in first.");
      return;
    }
    try {
      setIsSaving(true);
      setSaveMessage("");
      await addDoc(collection(db, "studySets"), {
        userId: auth.currentUser.uid,
        fileName: fileName || "Untitled Document",
        data: results,
        createdAt: serverTimestamp(),
      });
      setSaveMessage("Saved to Dashboard!");
    } catch (error) {
      console.error("Error saving document: ", error);
      setSaveMessage("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (quizAnswers[currentQuizIndex]) return;

    setQuizAnswers(prev => ({ ...prev, [currentQuizIndex]: option }));

    if (results && results.quiz[currentQuizIndex]) {
      const isCorrect = option === results.quiz[currentQuizIndex].answer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
    }
  };

  // NEW: Reset method if they want to re-try the quiz on the fly during the demo
  const handleResetQuiz = () => {
    setQuizAnswers({});
    setScore(0);
    setCurrentQuizIndex(0);
    setIsQuizFinished(false);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: userMessage }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    setTimeout(() => {
      let mockReply = "I've analyzed your document, but I couldn't find a specific section matching that question. Could you rephrase?";
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes("data protection")) {
        mockReply = "According to your notes, Data Protection involves safeguarding critical information from corruption, compromise, or loss. It ensures data privacy and structural compliance across network environments.";
      } else if (lowerMessage.includes("cloud security")) {
        mockReply = "Based on the uploaded summary, Cloud Security refers to the broad set of policies, technologies, applications, and controls deployed to protect virtualized data and its associated cloud infrastructure.";
      } else if (lowerMessage === "yes" || lowerMessage.includes("more details") || lowerMessage.includes("detail")) {
        mockReply = "Certainly! The document emphasizes utilizing targeted micro-segmentation configurations and strict firewall access boundaries as primary strategies to achieve this level of isolation.";
      }

      setChatMessages([...newMessages, { role: "ai", content: mockReply }]);
      setIsChatLoading(false);
    }, 1000);
  };

  if (!results) {
    return (
      <main style={pageStyle}>
        <aside style={sidebarStyle}><Sidebar /></aside>
        <section style={mainStyle}>
          <div style={emptyCardStyle}>
            <h1>No Results Yet</h1>
            <p style={{ color: "#9ca3af", marginBottom: "20px" }}>Please upload a document first.</p>
            <Link href="/upload" style={{ textDecoration: "none" }}>
              <button style={purpleButtonStyle}>Go to Upload</button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const currentQuiz = results.quiz?.[currentQuizIndex];
  const selectedAnswer = quizAnswers[currentQuizIndex];

  return (
    <main style={pageStyle}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .interactive-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4) !important; }
        .quiz-option:hover { background-color: rgba(139, 92, 246, 0.08) !important; border-color: rgba(139, 92, 246, 0.5) !important; }
        .chat-scroll::-webkit-scrollbar { width: 6px; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 10px; }
      `}} />

      <aside style={sidebarStyle}><Sidebar /></aside>

      <section style={mainStyle}>
        {/* --- DYNAMIC TRANSITION FROSTED GLASS MODAL --- */}
        {activeTab === "Quiz" && isQuizFinished && (
          <div style={modalOverlayBlurStyle}>
            <div style={modalCardStyle}>
              <div style={modalIconCircleStyle}>🎓</div>
              <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Quiz Completed!</h2>
              <p style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 28px 0" }}>Great effort! Here is your deep focus performance breakdown.</p>
              
              <div style={scoreMetricBoxStyle}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#a78bfa", letterSpacing: "1px", marginBottom: "4px" }}>TOTAL ACCURACY</div>
                <div style={{ fontSize: "48px", fontWeight: "800", color: "white" }}>
                  {score} <span style={{ color: "#4b5563", fontSize: "24px", fontWeight: "400" }}>/ {results.quiz.length}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>
                  Percentage Score: <b>{Math.round((score / results.quiz.length) * 100)}%</b>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                <button onClick={handleResetQuiz} style={secondaryButtonStyle}>
                  🔄 Try Again
                </button>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                  <button style={purpleButtonStyle}>
                    ▦ Go to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <header style={topBarStyle}>
          <div>
            <p style={{ color: "#9ca3af", margin: 0 }}>Notes Editor</p>
            <h1 style={{ margin: "6px 0 8px", fontSize: "28px" }}>AI Generated Study Notes</h1>
            {fileName && (
              <span style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#c4b5fd", padding: "4px 10px", borderRadius: "6px", fontSize: "13px", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
                📄 Source: {fileName}
              </span>
            )}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {saveMessage && (
              <span style={{ color: saveMessage.includes("Failed") || saveMessage.includes("Error") ? "#ef4444" : "#10b981", fontSize: "14px", fontWeight: "500" }}>
                {saveMessage}
              </span>
            )}
            <button onClick={handleSaveToCloud} disabled={isSaving} style={{ ...purpleButtonStyle, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}>
              {isSaving ? "Saving..." : "Save to Dashboard"}
            </button>
          </div>
        </header>

        <div style={tabsStyle}>
          <span onClick={() => setActiveTab("Notes")} style={activeTab === "Notes" ? activeTabStyle : inactiveTabStyle}>Notes</span>
          <span onClick={() => setActiveTab("Flashcards")} style={activeTab === "Flashcards" ? activeTabStyle : inactiveTabStyle}>Flashcards</span>
          <span onClick={() => setActiveTab("Quiz")} style={activeTab === "Quiz" ? activeTabStyle : inactiveTabStyle}>Quiz</span>
        </div>

        {/* --- NOTES TAB --- */}
        {activeTab === "Notes" && (
          <div style={contentGridStyle}>
            <div style={notesPanelStyle}>
              <section style={resultCardStyle}>
                <h2>Summary</h2>
                <p style={paragraphStyle}>{results.summary}</p>
              </section>

              <section style={resultCardStyle}>
                <h2 style={{ marginBottom: "16px" }}>Key Concepts</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {results.keyConcepts?.map((concept, index) => (
                    <span key={index} style={chipStyle}>{concept}</span>
                  ))}
                </div>
              </section>

              <section style={resultCardStyle}>
                <h2>Definitions</h2>
                {results.definitions?.map((item, index) => (
                  <p key={index} style={{...paragraphStyle, marginBottom: "12px"}}>
                    <b style={{ color: "#c4b5fd" }}>{item.term}:</b> {item.meaning}
                  </p>
                ))}
              </section>
            </div>

            {/* Chatbot Column */}
            <div style={{ display: "flex", flexDirection: "column", backgroundColor: "rgba(17,24,39,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", height: "calc(100vh - 220px)", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(31,41,55,0.8)" }}>
                <h3 style={{ margin: 0, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>✨</span> Chat with Notes
                </h3>
              </div>

              <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%", padding: "12px 16px", borderRadius: "14px", fontSize: "14px", lineHeight: "1.5",
                      backgroundColor: msg.role === "user" ? "#8b5cf6" : "rgba(31,41,55,0.9)", color: "white",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "14px", borderBottomLeftRadius: msg.role === "ai" ? "4px" : "14px",
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ padding: "12px 16px", borderRadius: "14px", backgroundColor: "rgba(31,41,55,0.9)", color: "#9ca3af", fontSize: "14px" }}>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(17,24,39,0.9)" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about your notes..."
                    style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#111827", color: "white", outline: "none", fontSize: "14px" }}
                  />
                  <button type="submit" disabled={!chatInput.trim()} style={{ ...purpleButtonStyle, padding: "10px 16px", opacity: !chatInput.trim() ? 0.5 : 1 }}>
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- FLASHCARDS TAB --- */}
        {activeTab === "Flashcards" && (
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", color: "#9ca3af" }}>
              <span>Progress</span>
              <span>Card {currentCardIndex + 1} of {results.flashcards.length}</span>
            </div>
            
            <section className="interactive-card" onClick={() => setShowAnswer(!showAnswer)} style={{ ...flashcardStyle, minHeight: "350px", transition: "all 0.2s ease" }}>
              <p style={{ color: "#a78bfa", fontSize: "14px", letterSpacing: "2px" }}>{showAnswer ? "ANSWER" : "QUESTION"}</p>
              {!showAnswer ? (
                <h2 style={{ fontSize: "28px", padding: "0 20px" }}>{results.flashcards[currentCardIndex].question}</h2>
              ) : (
                <p style={{ ...paragraphStyle, fontSize: "20px", padding: "0 20px" }}>{results.flashcards[currentCardIndex].answer}</p>
              )}
              <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "auto" }}>Click anywhere on card to flip</p>
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <button disabled={currentCardIndex === 0} onClick={() => { setCurrentCardIndex(prev => prev - 1); setShowAnswer(false); }} style={secondaryButtonStyle}>← Previous</button>
              <button disabled={currentCardIndex === results.flashcards.length - 1} onClick={() => { setCurrentCardIndex(prev => prev + 1); setShowAnswer(false); }} style={secondaryButtonStyle}>Next Card →</button>
            </div>
          </div>
        )}

        {/* --- QUIZ TAB --- */}
        {activeTab === "Quiz" && currentQuiz && (
          <div style={{ maxWidth: "700px", margin: "0 auto", paddingTop: "20px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", color: "#9ca3af" }}>
              <span>Question {currentQuizIndex + 1} of {results.quiz.length}</span>
              <span>Score: {score} / {results.quiz.length}</span>
            </div>

            <section style={{...quizCardStyle, padding: "40px"}}>
              <h2 style={{ fontSize: "22px", marginBottom: "24px" }}>{currentQuiz.question}</h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {currentQuiz.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuiz.answer;
                  const showFeedback = !!selectedAnswer;

                  return (
                    <button
                      key={option}
                      className="quiz-option"
                      onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        fontSize: "15px",
                        color: "white",
                        outline: "none",
                        border: showFeedback 
                          ? (isCorrect ? "1px solid #22c55e" : (isSelected ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.08)")) 
                          : (isSelected ? "1px solid #8b5cf6" : "1px solid rgba(255,255,255,0.08)"),
                        backgroundColor: showFeedback 
                          ? (isCorrect ? "rgba(34,197,94,0.12)" : (isSelected ? "rgba(239,68,68,0.12)" : "#111827")) 
                          : (isSelected ? "rgba(139, 92, 246, 0.15)" : "#111827"),
                        cursor: selectedAnswer ? "default" : "pointer", 
                        transition: "all 0.2s ease"
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", backgroundColor: selectedAnswer === currentQuiz.answer ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
                  <p style={{ color: selectedAnswer === currentQuiz.answer ? "#22c55e" : "#f87171", fontWeight: "bold", margin: "0 0 8px 0" }}>
                    {selectedAnswer === currentQuiz.answer ? "✓ Correct!" : "✗ Incorrect"}
                  </p>
                  {selectedAnswer !== currentQuiz.answer && (
                    <p style={{ color: "#d1d5db", margin: 0, fontSize: "14px" }}>The correct answer is: <b>{currentQuiz.answer}</b></p>
                  )}
                </div>
              )}
            </section>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <button disabled={currentQuizIndex === 0} onClick={() => setCurrentQuizIndex(prev => prev - 1)} style={secondaryButtonStyle}>← Previous</button>
              
              {currentQuizIndex === results.quiz.length - 1 ? (
                /* FIXED: Triggers frosted glass display layout state on final completion node */
                <button onClick={() => setIsQuizFinished(true)} style={purpleButtonStyle}>
                  Finish Quiz
                </button>
              ) : (
                <button onClick={() => setCurrentQuizIndex(prev => prev + 1)} style={secondaryButtonStyle}>
                  Next Question →
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || user.email || "User");
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "▦" },
    { name: "Folders", path: "/folders", icon: "📁" },
    { name: "Settings", path: "/settings", icon: "⚙" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div>
        <h2 style={{ margin: "0 0 24px", fontSize: "18px" }}>✦ NotesTaker AI</h2>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <button style={{ ...purpleButtonStyle, width: "100%", marginBottom: "24px" }}>+ New Study Set</button>
        </Link>
        <nav style={navStyle}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", color: isActive ? "white" : "#cbd5e1", backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer" }}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div style={{ ...profileStyle, marginTop: "auto" }}>
        <p style={{ margin: 0 }}>👤 {userName}</p>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>AI Study Workspace</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", backgroundColor: "#050816", color: "white", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#a78bfa", fontWeight: "600", marginBottom: "8px" }}>✦ NotesTaker AI</p>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading workspace configuration...</p>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}

// --- High Fidelity Design Architecture Tokens ---
const pageStyle = { minHeight: "100vh", display: "flex", background: "linear-gradient(to bottom right, #050816, #0b1023)", color: "white" } as const;
const sidebarStyle = { width: "250px", backgroundColor: "#11131a", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "24px 18px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "32px", overflowY: "auto" } as const;
const topBarStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" } as const;
const contentGridStyle = { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "24px" } as const;
const notesPanelStyle = { backgroundColor: "rgba(17,24,39,0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" } as const;
const tabsStyle = { display: "flex", gap: "24px", borderBottom: "1px solid #374151", paddingBottom: "14px", marginBottom: "24px" } as const;
const activeTabStyle = { color: "#c4b5fd", borderBottom: "2px solid #8b5cf6", paddingBottom: "14px", cursor: "pointer", fontWeight: "bold", marginBottom: "-15px" } as const;
const inactiveTabStyle = { color: "#9ca3af", cursor: "pointer", paddingBottom: "14px", marginBottom: "-15px", transition: "color 0.2s" } as const;
const resultCardStyle = { backgroundColor: "rgba(31,41,55,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px", marginBottom: "18px" } as const;
const flashcardStyle = { background: "linear-gradient(to bottom right, rgba(31,41,55,0.95), rgba(17,24,39,0.95))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "34px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between" } as const;
const quizCardStyle = { backgroundColor: "rgba(17,24,39,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" } as const;
const paragraphStyle = { color: "#d1d5db", lineHeight: "1.7", margin: 0 } as const;
const chipStyle = { backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#d8b4fe", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", border: "1px solid rgba(139, 92, 246, 0.3)" } as const;
const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 16px", fontWeight: "600", cursor: "pointer" } as const;
const secondaryButtonStyle = { backgroundColor: "transparent", color: "#a78bfa", border: "1px solid #8b5cf6", borderRadius: "10px", padding: "10px 20px", fontWeight: "600", cursor: "pointer" } as const;
const navStyle = { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" } as const;
const profileStyle = { borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", color: "#9ca3af", fontSize: "13px" } as const;
const emptyCardStyle = { maxWidth: "420px", margin: "120px auto", backgroundColor: "rgba(17,24,39,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "32px", textAlign: "center" } as const;

// NEW: Frosted Glass Overlay Design Layout Tokens
const modalOverlayBlurStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(3, 3, 3, 0.6)", // Transparent dark shroud layer
  backdropFilter: "blur(12px)", // Premium background frosted glass effect
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "24px"
};

const modalCardStyle = {
  width: "100%",
  maxWidth: "460px",
  backgroundColor: "#09090b",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  padding: "40px 32px",
  textAlign: "center" as const,
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)"
};

const modalIconCircleStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  backgroundColor: "rgba(139, 92, 246, 0.15)",
  border: "1px solid rgba(139, 92, 246, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  margin: "0 auto 20px auto"
};

const scoreMetricBoxStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "14px",
  padding: "24px",
  marginBottom: "32px"
};