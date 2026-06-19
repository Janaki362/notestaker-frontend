"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const FlashcardItem = ({ card, idx }: { card: any, idx: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Bulletproof text extraction for flashcards
  const questionText = card.question || card.front || card.term || card.title || `Flashcard ${idx + 1}`;
  const answerText = card.answer || card.back || card.definition || card.description || "No answer provided.";

  return (
    <div onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: "1000px", height: "260px", cursor: "pointer" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", textAlign: "center", transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <p style={{ fontWeight: "700", color: "#2563eb", marginBottom: "16px", fontSize: "14px" }}>Flashcard {idx + 1}</p>
          <h3 style={{ fontSize: "18px", margin: "0 0 16px 0", color: "#111827", lineHeight: "1.5" }}>{questionText}</h3>
          <p style={{ marginTop: "auto", fontSize: "13px", color: "#9ca3af", fontWeight: "500" }}>Click to flip ↺</p>
        </div>
        <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "32px 24px", display: "flex", flexDirection: "column", justifyContent: "center", transform: "rotateY(180deg)", boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.1)" }}>
          <p style={{ fontWeight: "700", color: "#2563eb", marginBottom: "16px", fontSize: "14px" }}>Answer</p>
          <div style={{ color: "#1e3a8a", fontSize: "16px", lineHeight: "1.6", fontWeight: "500", overflowY: "auto" }}>{answerText}</div>
        </div>
      </div>
    </div>
  );
};

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dbId = searchParams.get("id");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [fileName, setFileName] = useState("Document Analysis");
  const [activeTab, setActiveTab] = useState("summary");
  const [userName, setUserName] = useState("User");

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: any }[]>([{ 
    sender: "ai", 
    text: (
      <div>
        <p style={{ margin: "0 0 12px 0" }}>I've analyzed this document.</p>
        <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#374151" }}>Try asking:</p>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", color: "#4b5563" }}>
          <li>Summarize the main topics</li>
          <li>Generate study tips</li>
          <li>Explain Zero Trust Architecture</li>
        </ul>
      </div>
    )
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName || currentUser.email || "User");
      } else router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetchLatest = async () => {
      try {
        const q = query(collection(db, "studySets"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(1));
        const snap = await getDocs(q);
        return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
      } catch (e) { return null; }
    };

    const loadData = async () => {
      setLoading(true);
      let dataToRender: any = null;
      if (dbId && dbId !== "undefined") {
        try {
          const docRef = doc(db, "studySets", dbId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) dataToRender = docSnap.data();
        } catch (error) {}
      }
      if (!dataToRender) {
        const latest = await fetchLatest();
        if (latest) dataToRender = latest;
      }
      if (dataToRender) {
        setResults(dataToRender.data || dataToRender);
        setFileName(dataToRender.fileName || "Document Analysis");
      }
      setLoading(false);
    };
    loadData();
  }, [user, dbId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;
    const userText = inputMessage.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch("https://notestaker-backend-194267172594.us-central1.run.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, documentContext: results?.summary || "", sessionId }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Trouble connecting to server." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (isQuizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const renderTabContent = () => {
    if (!results) return null;

    if (activeTab === "summary") {
      const summaryText = results.summary || results.text || results.content || "No summary available.";
      return (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Summary</h2>
          <p style={{ lineHeight: "1.7", color: "#374151" }}>{summaryText}</p>
        </div>
      );
    }

    if (activeTab === "keyConcepts") {
      const concepts = results.keyConcepts || results.concepts || [];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {concepts.length > 0 ? concepts.map((concept: any, idx: number) => {
            const title = concept.term || concept.title || concept.name || concept.topic || `Concept ${idx + 1}`;
            const description = concept.definition || concept.description || concept.content || concept.summary || (typeof concept === 'string' ? concept : JSON.stringify(concept));

            return (
              <div key={idx} style={cardStyle}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{title}</h3>
                <p style={{ margin: 0, color: "#4b5563", lineHeight: "1.6" }}>{description}</p>
              </div>
            );
          }) : <div style={cardStyle}>No key concepts extracted.</div>}
        </div>
      );
    }

    if (activeTab === "flashcards") {
      const cards = results.flashcards || results.cards || [];
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {cards.length > 0 ? cards.map((card: any, idx: number) => <FlashcardItem key={idx} card={card} idx={idx} />) : <div style={cardStyle}>No flashcards generated.</div>}
        </div>
      );
    }

    if (activeTab === "quiz") {
      const questions = results.quiz || results.questions || [];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {questions.length > 0 ? questions.map((q: any, idx: number) => {
            const questionText = q.question || q.title || `Question ${idx + 1}`;
            const optionsArray = Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : []);

            return (
              <div key={idx} style={cardStyle}>
                <p style={{ fontWeight: "700", color: "#111827", marginBottom: "16px", fontSize: "16px" }}>{idx + 1}. {questionText}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {optionsArray.map((opt: string, oIdx: number) => {
                    const isSelected = quizAnswers[idx] === opt;
                    let bgColor = isSelected ? "#eff6ff" : "#f9fafb";
                    let borderColor = isSelected ? "#2563eb" : "#e5e7eb";
                    let textColor = isSelected ? "#1d4ed8" : "#374151";

                    if (isQuizSubmitted) {
                      const isCorrect = q.answer === opt || q.correctAnswer === opt;
                      if (isCorrect) { bgColor = "#ecfdf5"; borderColor = "#10b981"; textColor = "#065f46"; } 
                      else if (isSelected && !isCorrect) { bgColor = "#fef2f2"; borderColor = "#ef4444"; textColor = "#991b1b"; }
                    }
                    return (
                      <div key={oIdx} onClick={() => handleOptionSelect(idx, opt)}
                        style={{ padding: "14px 16px", border: `2px solid ${borderColor}`, borderRadius: "10px", backgroundColor: bgColor, color: textColor, cursor: isQuizSubmitted ? "default" : "pointer", fontWeight: isSelected ? "600" : "500", transition: "all 0.2s" }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }) : <div style={cardStyle}>No quiz questions generated.</div>}
        </div>
      );
    }
    return null;
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading your notes...</div>;

  const quizData = results?.quiz || results?.questions || [];
  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(quizAnswers).length;
  const progressPercentage = totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);

  let score = 0;
  if (isQuizSubmitted && totalQuestions > 0) {
    quizData.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.answer || quizAnswers[idx] === q.correctAnswer) score++;
    });
  }
  
  const scorePercentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);

  return (
    <main style={pageStyle}>
      <aside style={sidebarStyle}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: "18px", color: "#111827", fontWeight: "700" }}>
            <span style={{ color: "#2563eb", marginRight: "6px" }}>✦</span>NotesTaker AI
          </h2>
          <Link href="/upload" style={{ textDecoration: "none" }}><button style={primaryButtonStyle}>+ New Study Set</button></Link>
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
            {[{ name: "Dashboard", path: "/dashboard", icon: "▦" }, { name: "Folders", path: "/folders", icon: "📁" }, { name: "Settings", path: "/settings", icon: "⚙" }].map((item) => (
              <Link key={item.name} href={item.path} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", color: "#4b5563", fontWeight: "500" }}>
                  <span>{item.icon}</span><span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111827", fontWeight: "600", fontSize: "14px" }}>
              <span style={{ backgroundColor: "#e5e7eb", borderRadius: "50%", padding: "4px" }}>👤</span> {userName}
            </div>
          </div>
        </div>
      </aside>

      <section style={mainStyle}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#111827", fontWeight: "800" }}>{fileName}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#6b7280", fontSize: "14px", fontWeight: "500", marginTop: "12px" }}>
            <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Student Mode</span>
            <span style={{ backgroundColor: "#f3f4f6", color: "#4b5563", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Vertex AI</span>
            <span style={{ backgroundColor: "#ecfdf5", color: "#059669", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>⚡ Cached</span>
            <span style={{ marginLeft: "4px" }}>• Processed Successfully</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e5e7eb", marginBottom: "32px" }}>
              {[{ id: "summary", label: "Summary" }, { id: "keyConcepts", label: "Key Concepts" }, { id: "flashcards", label: "Flashcards" }, { id: "quiz", label: "Practice Quiz" }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ background: "none", padding: "0 0 12px 0", border: "none", borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === tab.id ? "#2563eb" : "#6b7280", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div>{renderTabContent()}</div>
          </div>

          {activeTab === "quiz" ? (
            <div style={{ width: "350px", flexShrink: 0, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", position: "sticky", top: "48px" }}>
              <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}><span>🎯</span> Quiz Progress</h3>
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#4b5563" }}>
                  <span>Questions Answered</span><span>{answeredQuestions} / {totalQuestions}</span>
                </div>
                <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
                  <div style={{ width: `${progressPercentage}%`, backgroundColor: "#2563eb", height: "100%", transition: "width 0.3s ease" }}></div>
                </div>
              </div>
              {isQuizSubmitted ? (
                <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", textAlign: "center", marginBottom: "24px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280", fontWeight: "600" }}>Final Score</p>
                  <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: score === totalQuestions ? "#059669" : "#111827" }}>
                    {score} <span style={{ fontSize: "20px", color: "#9ca3af" }}>/ {totalQuestions}</span>
                  </p>
                  <button onClick={() => setShowScoreModal(true)} style={{ marginTop: "16px", background: "none", border: "none", color: "#2563eb", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>View Score Details</button>
                </div>
              ) : (
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>Test your knowledge without AI assistance. Submit to view your score.</p>
                </div>
              )}
              <button 
                onClick={() => { setIsQuizSubmitted(true); setShowScoreModal(true); }} 
                disabled={isQuizSubmitted || answeredQuestions === 0} 
                style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: isQuizSubmitted || answeredQuestions === 0 ? "#e5e7eb" : "#2563eb", color: isQuizSubmitted || answeredQuestions === 0 ? "#9ca3af" : "#ffffff", fontWeight: "700", cursor: isQuizSubmitted || answeredQuestions === 0 ? "default" : "pointer", transition: "all 0.2s" }}
              >
                {isQuizSubmitted ? "Quiz Submitted" : "Submit Quiz"}
              </button>
            </div>
          ) : (
            <div style={{ width: "350px", flexShrink: 0, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", display: "flex", flexDirection: "column", height: "600px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", position: "sticky", top: "48px" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#fafafa", borderRadius: "16px 16px 0 0" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "18px" }}>✨</span> Ask AI Assistant</h3>
              </div>
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.map((msg, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ padding: "10px 16px", borderRadius: msg.sender === "user" ? "16px 16px 0px 16px" : "16px 16px 16px 0px", backgroundColor: msg.sender === "user" ? "#2563eb" : "#f3f4f6", color: msg.sender === "user" ? "#ffffff" : "#1f2937", maxWidth: "85%", fontSize: "14px", lineHeight: "1.5", border: msg.sender === "ai" ? "1px solid #e5e7eb" : "none" }}>{msg.text}</div>
                  </div>
                ))}
                {isChatLoading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ padding: "10px 16px", borderRadius: "16px 16px 16px 0px", backgroundColor: "#f3f4f6", color: "#6b7280", fontStyle: "italic", fontSize: "14px", border: "1px solid #e5e7eb" }}>AI is thinking...</div></div>}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} style={{ display: "flex", padding: "16px", borderTop: "1px solid #e5e7eb", backgroundColor: "#fafafa", gap: "12px", borderRadius: "0 0 16px 16px" }}>
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask a question..." disabled={isChatLoading} style={{ flex: 1, padding: "10px 16px", borderRadius: "99px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", minWidth: 0 }} />
                <button type="submit" disabled={!inputMessage.trim() || isChatLoading} style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "99px", padding: "0 20px", fontWeight: "600", cursor: "pointer", opacity: !inputMessage.trim() || isChatLoading ? 0.5 : 1 }}>Send</button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* --- LIGHT MODE QUIZ COMPLETION MODAL --- */}
      {showScoreModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(17, 24, 39, 0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ position: "relative", backgroundColor: "#ffffff", color: "#111827", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e5e7eb" }}>
            
            <button onClick={() => setShowScoreModal(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#9ca3af", fontSize: "20px", cursor: "pointer", padding: "4px" }}>✕</button>

            <div style={{ fontSize: "40px", marginBottom: "16px", display: "inline-flex", padding: "16px", backgroundColor: "#eff6ff", borderRadius: "50%", border: "1px solid #bfdbfe" }}>🎓</div>
            
            <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px", color: "#111827" }}>Quiz Completed!</h2>
            <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "32px", lineHeight: "1.5" }}>Great effort! Here is your performance breakdown.</p>

            <div style={{ backgroundColor: "#f9fafb", borderRadius: "16px", padding: "32px 20px", marginBottom: "32px", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#2563eb", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Total Accuracy</p>
              <div style={{ fontSize: "48px", fontWeight: "800", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", color: "#111827" }}>
                {score} <span style={{ fontSize: "24px", color: "#9ca3af" }}>/ {totalQuestions}</span>
              </div>
              <p style={{ color: "#4b5563", fontSize: "14px", marginTop: "12px", fontWeight: "500" }}>Percentage Score: {scorePercentage}%</p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => { setIsQuizSubmitted(false); setQuizAnswers({}); setShowScoreModal(false); }} 
                style={{ flex: 1, padding: "14px", borderRadius: "12px", backgroundColor: "#ffffff", border: "1px solid #d1d5db", color: "#374151", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
              >
                ↻ Try Again
              </button>
              <button 
                onClick={() => router.push("/dashboard")} 
                style={{ flex: 1, padding: "14px", borderRadius: "12px", backgroundColor: "#2563eb", border: "none", color: "#ffffff", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.3)", transition: "all 0.2s" }}
              >
                Go to Dashboard
              </button>
            </div>
            
            <p style={{ margin: "20px 0 0 0", fontSize: "13px" }}>
              <button onClick={() => setShowScoreModal(false)} style={{ background: "none", border: "none", color: "#6b7280", textDecoration: "underline", cursor: "pointer" }}>Close & Review Answers</button>
            </p>

          </div>
        </div>
      )}
    </main>
  );
}

// --- NEW DEFAULT EXPORT WITH SUSPENSE BOUNDARY ---
export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>Loading your workspace...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

const pageStyle = { minHeight: "100vh", display: "flex", backgroundColor: "#ffffff", fontFamily: "'Inter', sans-serif" } as const;
const sidebarStyle = { width: "260px", backgroundColor: "#fafafa", borderRight: "1px solid #e5e7eb", padding: "24px", zIndex: 10 } as const;
const mainStyle = { flex: 1, padding: "48px 64px", overflowY: "auto", backgroundColor: "#ffffff" } as const;
const primaryButtonStyle = { width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" } as const;
const cardStyle = { padding: "24px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" };