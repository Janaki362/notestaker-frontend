"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <div style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: "#111827", letterSpacing: "-0.5px" }}>
          <span style={{ color: "#2563eb" }}>✦</span> NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Link href="#features" style={navLinkStyle}>Product</Link>
          <Link href="#pricing" style={navLinkStyle}>Pricing</Link>
          <Link href="#join" style={navLinkStyle}>Community</Link>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {/* Sign In targets the existing user session entrance */}
          <Link href="/login" style={{...navLinkStyle, color: "#111827", fontWeight: "600"}}>Sign In</Link>
          
          {/* Get Started routes new users directly to the styled registration flow */}
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={primaryButtonStyle}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={badgeStyle}>
          INTELLIGENT SYNTHESIS ENGINE
        </div>
        
        <h1 style={heroHeadingStyle}>
          Master Any Subject <br />
          <span style={{ color: "#2563eb" }}>with AI</span>
        </h1>
        
        <p style={heroSubheadingStyle}>
          NotesTaker AI transforms chaotic source material into structured knowledge. 
          The high-fidelity workspace for deep focus and intellectual mastery.
        </p>
        
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "64px" }}>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={{ ...primaryButtonStyle, padding: "14px 28px", fontSize: "15px" }}>
              Start Learning Free
            </button>
          </Link>
          <Link href="#features" style={{ textDecoration: "none" }}>
            <button style={secondaryButtonStyle}>
              <span style={{ fontSize: "12px", color: "#2563eb" }}>▶</span> Watch Demo
            </button>
          </Link>
        </div>

        {/* ACCURATE RESULTS PAGE MOCKUP */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827" }}>✦ NotesTaker AI</span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Workspace / <span style={{ color: "#111827", fontWeight: "600" }}>Neural Biology 101</span></span>
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#6b7280", fontWeight: "500" }}>
              <span>🔒 Secure</span>
            </div>
          </div>
          
          <div style={mockupBodyStyle}>
            {/* Mock Sidebar */}
            <div style={mockupSidebarStyle}>
              <div style={{ backgroundColor: "#2563eb", color: "white", borderRadius: "6px", padding: "8px", fontSize: "10px", fontWeight: "700", textAlign: "center", marginBottom: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                + New Study Set
              </div>
              <div style={sidebarItemInactive}>▦ Dashboard</div>
              <div style={sidebarItemInactive}>📁 Folders</div>
              <div style={sidebarItemInactive}>⚙ Settings</div>
            </div>
            
            {/* Mock Results Content Layout */}
            <div style={mockupContentStyle}>
              {/* Mock Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px", fontWeight: "500" }}>Notes Editor</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px" }}>AI Generated Study Notes</div>
                </div>
                <div style={{ backgroundColor: "#2563eb", color: "white", borderRadius: "6px", padding: "8px 12px", fontSize: "10px", fontWeight: "600" }}>
                  Save to Dashboard
                </div>
              </div>
              
              {/* Mock Tabs */}
              <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700", borderBottom: "2px solid #2563eb", paddingBottom: "6px", marginBottom: "-7px" }}>Notes</span>
                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>Flashcards</span>
                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>Quiz</span>
              </div>

              {/* Mock 2-Column Architecture */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", flex: 1 }}>
                
                {/* Left: Notes & Concepts */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={mockResultCardStyle}>
                    <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px", color: "#111827" }}>Summary</div>
                    <div style={{ width: "100%", height: "5px", backgroundColor: "#f3f4f6", borderRadius: "3px", marginBottom: "6px" }}></div>
                    <div style={{ width: "100%", height: "5px", backgroundColor: "#f3f4f6", borderRadius: "3px", marginBottom: "6px" }}></div>
                    <div style={{ width: "90%", height: "5px", backgroundColor: "#f3f4f6", borderRadius: "3px", marginBottom: "6px" }}></div>
                    <div style={{ width: "60%", height: "5px", backgroundColor: "#f3f4f6", borderRadius: "3px" }}></div>
                  </div>
                  <div style={mockResultCardStyle}>
                    <div style={{ fontSize: "12px", fontWeight: "700", marginBottom: "10px", color: "#111827" }}>Key Concepts</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <div style={mockChipStyle}></div>
                      <div style={{...mockChipStyle, width: "60px"}}></div>
                      <div style={{...mockChipStyle, width: "45px"}}></div>
                      <div style={{...mockChipStyle, width: "70px"}}></div>
                    </div>
                  </div>
                </div>

                {/* Right: Chatbot */}
                <div style={mockChatContainerStyle}>
                  <div style={mockChatHeaderStyle}>✨ Chat with Notes</div>
                  <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column" }}>
                    <div style={mockChatBubbleStyle}>
                      Hi! I've analyzed your notes. What would you like to know?
                    </div>
                  </div>
                  <div style={{ padding: "10px", borderTop: "1px solid #e5e7eb", display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: "4px", height: "20px", backgroundColor: "#ffffff" }}></div>
                    <div style={{ width: "30px", backgroundColor: "#2563eb", borderRadius: "4px", height: "20px" }}></div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={featuresSectionStyle}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px", letterSpacing: "-0.5px", color: "#111827" }}>Powerful Study Workflows</h2>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Everything you need to digest complex information in seconds, not hours.</p>
        </div>
        
        <div style={gridStyle}>
          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>📄</div>
            <h3 style={featureTitleStyle}>PDF to Interactive Notes</h3>
            <p style={featureDescriptionStyle}>Upload your textbooks and papers. NotesTaker AI extracts the core concepts, defines complex terms, and builds a clickable structure.</p>
            <div style={miniProgressBarStyle}>
              <div style={{ width: "45%", height: "100%", backgroundColor: "#2563eb" }}></div>
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>ANALYZING...</span>
            </div>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>🎙️</div>
            <h3 style={featureTitleStyle}>Live Transcription</h3>
            <p style={featureDescriptionStyle}>Record lectures in real-time. Our AI captures nuances and tags key moments for later review.</p>
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "24px", marginTop: "auto", paddingLeft: "4px" }}>
              <div style={{ width: "3px", height: "12px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
              <div style={{ width: "3px", height: "20px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
              <div style={{ width: "3px", height: "14px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
              <div style={{ width: "3px", height: "24px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
              <div style={{ width: "3px", height: "10px", backgroundColor: "#2563eb", borderRadius: "2px" }}></div>
            </div>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>📺</div>
            <h3 style={featureTitleStyle}>YouTube Sync</h3>
            <p style={featureDescriptionStyle}>Paste a URL. Get a timestamped summary and a deck of Spaced Repetition flashcards instantly.</p>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>🔲</div>
            <h3 style={featureTitleStyle}>The Unified Canvas</h3>
            <p style={featureDescriptionStyle}>Review summaries, target weak concepts in customized quiz modes, and converse with an isolated RAG training container smoothly.</p>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Section */}
      <section id="pricing" style={pricingSectionStyle}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "12px", color: "#111827", letterSpacing: "-0.5px" }}>Investment in Knowledge</h2>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Simple pricing for lifelong learning.</p>
        </div>

        <div style={pricingGridStyle}>
          {/* Starter Plan */}
          <div style={pricingCardStyle}>
            <p style={planNameStyle}>STARTER</p>
            <h3 style={planPriceStyle}>$0 <span style={{ fontSize: "15px", color: "#6b7280", fontWeight: "500" }}>/ forever</span></h3>
            <ul style={planFeatureListStyle}>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> 5 AI Credits / month</li>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Standard Web Workspace</li>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Up to 3 Study Folders</li>
            </ul>
            <Link href="/signup" style={{ textDecoration: "none", marginTop: "auto" }}>
              <button style={pricingButtonSecondaryStyle}>Get Started</button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div style={{ ...pricingCardStyle, border: "2px solid #2563eb", position: "relative", boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1)" }}>
            <span style={premiumBadgeStyle}>MOST POPULAR</span>
            <p style={planNameStyle}>FORGE PRO</p>
            <h3 style={planPriceStyle}>$12 <span style={{ fontSize: "15px", color: "#6b7280", fontWeight: "500" }}>/ month</span></h3>
            <ul style={planFeatureListStyle}>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Unlimited AI Synthesis</li>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Voice Recording + Sync</li>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Unlimited Workspaces</li>
              <li><span style={{color: "#2563eb", fontWeight: "bold", marginRight: "6px"}}>✓</span> Priority AI Processing</li>
            </ul>
            <Link href="/signup" style={{ textDecoration: "none", marginTop: "auto" }}>
              <button style={pricingButtonActiveStyle}>Upgrade to Pro</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section id="join" style={ctaSectionStyle}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "12px", color: "#111827", letterSpacing: "-0.5px" }}>Ready to sharpen your mind?</h2>
        <p style={{ color: "#4b5563", fontSize: "15px", marginBottom: "32px", maxWidth: "540px", margin: "0 auto 32px auto", lineHeight: "1.6" }}>
          NotesTaker AI transforms chaotic source material into structured knowledge. The high-fidelity workspace for deep focus and intellectual mastery.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "420px", margin: "0 auto" }}>
          <input type="email" placeholder="Enter your email" style={ctaInputStyle} />
          <button style={primaryButtonStyle}>Get Invitation</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto", color: "#6b7280", fontSize: "13px", fontWeight: "500" }}>
          <div>© 2026 NotesTaker AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="#features" style={{ color: "inherit", textDecoration: "none" }}>PRODUCT</Link>
            <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>ABOUT</Link>
            <Link href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>PRICING</Link>
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>TERMS</Link>
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>PRIVACY POLICY</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- Enterprise Light Mode Tokens & Styles ---
const pageStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", color: "#111827", fontFamily: "'Urbanist', 'Inter', sans-serif" } as const;
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 64px", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", position: "sticky" as const, top: 0, zIndex: 100, borderBottom: "1px solid #f3f4f6" } as const;
const navLinkStyle = { color: "#4b5563", textDecoration: "none", fontSize: "14px", fontWeight: "600", transition: "color 0.2s" } as const;

const heroStyle = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "100px 24px 0 24px", maxWidth: "1200px", margin: "0 auto" } as const;
const badgeStyle = { display: "inline-block", padding: "6px 14px", borderRadius: "20px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: "11px", fontWeight: "700", marginBottom: "32px", letterSpacing: "1px" } as const;
const heroHeadingStyle = { fontSize: "68px", lineHeight: "1.1", margin: "0 0 24px 0", letterSpacing: "-2px", fontWeight: "800", color: "#111827" } as const;
const heroSubheadingStyle = { fontSize: "19px", color: "#4b5563", maxWidth: "620px", margin: "0 auto 40px auto", lineHeight: "1.6", fontWeight: "500" } as const;

// UPDATED: Mockup Architecture Tokens
const mockupContainerStyle = { width: "100%", maxWidth: "880px", backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderBottom: "none", borderRadius: "16px 16px 0 0", padding: "16px 16px 0 16px", boxShadow: "0 -20px 40px rgba(0, 0, 0, 0.05)" } as const;
const mockupHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "16px" } as const;
const mockupBodyStyle = { display: "flex", minHeight: "340px", backgroundColor: "#fafafa", borderRadius: "12px 12px 0 0", border: "1px solid #e5e7eb", borderBottom: "none", overflow: "hidden" } as const;

const mockupSidebarStyle = { width: "150px", borderRight: "1px solid #e5e7eb", padding: "16px 12px", display: "flex", flexDirection: "column" as const, gap: "8px", backgroundColor: "#fafafa" };
const sidebarItemInactive = { padding: "6px 10px", fontSize: "11px", textAlign: "left" as const, color: "#4b5563", fontWeight: "600" };

const mockupContentStyle = { flex: 1, padding: "24px", display: "flex", flexDirection: "column" as const, backgroundColor: "#ffffff" };

const mockResultCardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" } as const;
const mockChipStyle = { width: "50px", height: "14px", backgroundColor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" } as const;
const mockChatContainerStyle = { border: "1px solid #e5e7eb", borderRadius: "10px", display: "flex", flexDirection: "column" as const, backgroundColor: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" } as const;
const mockChatHeaderStyle = { padding: "10px 12px", borderBottom: "1px solid #e5e7eb", fontSize: "11px", fontWeight: "700", backgroundColor: "#fafafa", color: "#111827" } as const;
const mockChatBubbleStyle = { alignSelf: "flex-start", backgroundColor: "#f3f4f6", padding: "8px 10px", borderRadius: "8px", fontSize: "10px", color: "#111827", maxWidth: "85%", borderBottomLeftRadius: "2px" } as const;

const featuresSectionStyle = { padding: "120px 64px", backgroundColor: "#fafafa", borderTop: "1px solid #e5e7eb" } as const;
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px", maxWidth: "1100px", margin: "0 auto" } as const;
const featureCardStyle = { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "36px", display: "flex", flexDirection: "column" as const, position: "relative" as const, minHeight: "240px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" };
const featureTitleStyle = { fontSize: "20px", marginBottom: "12px", fontWeight: "700", color: "#111827" } as const;
const featureDescriptionStyle = { color: "#4b5563", margin: "0 0 24px 0", lineHeight: "1.6", fontSize: "15px" } as const;
const iconBoxStyle = { width: "48px", height: "48px", borderRadius: "10px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "20px" } as const;

const miniProgressBarStyle = { width: "100%", height: "32px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", position: "relative" as const, marginTop: "auto" };

const pricingSectionStyle = { padding: "120px 64px", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" } as const;
const pricingGridStyle = { display: "flex", gap: "24px", justifyContent: "center", maxWidth: "800px", margin: "0 auto" } as const;
const pricingCardStyle = { flex: 1, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column" as const, minHeight: "440px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" };
const planNameStyle = { fontSize: "13px", fontWeight: "700", color: "#4b5563", letterSpacing: "1px", margin: "0 0 16px 0" } as const;
const planPriceStyle = { fontSize: "48px", fontWeight: "800", color: "#111827", margin: "0 0 32px 0", letterSpacing: "-1px" } as const;
const planFeatureListStyle = { listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column" as const, gap: "16px", color: "#4b5563", fontSize: "15px", textAlign: "left" as const, fontWeight: "500" };

const premiumBadgeStyle = { position: "absolute" as const, top: "-14px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#2563eb", color: "white", fontSize: "11px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px", letterSpacing: "0.5px" };

const ctaSectionStyle = { padding: "120px 24px", backgroundColor: "#fafafa", borderTop: "1px solid #e5e7eb", textAlign: "center" as const } as const;
const ctaInputStyle = { padding: "14px 16px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#111827", outline: "none", fontSize: "15px", width: "260px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" } as const;

const footerStyle = { padding: "40px 64px", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb" } as const;

const primaryButtonStyle = { backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 24px", fontWeight: "600", cursor: "pointer", fontSize: "14px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", transition: "background-color 0.2s" } as const;
const secondaryButtonStyle = { backgroundColor: "#ffffff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", padding: "12px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", transition: "all 0.2s" } as const;
const pricingButtonActiveStyle = { width: "100%", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "14px", fontWeight: "600", cursor: "pointer", fontSize: "15px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", transition: "background-color 0.2s" } as const;
const pricingButtonSecondaryStyle = { width: "100%", backgroundColor: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "14px", fontWeight: "600", cursor: "pointer", fontSize: "15px", transition: "all 0.2s" } as const;