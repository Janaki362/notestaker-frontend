"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={pageStyle}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#a78bfa" }}>✦</span> NotesTaker AI
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <Link href="#features" style={navLinkStyle}>Product</Link>
          <Link href="#pricing" style={navLinkStyle}>Pricing</Link>
          <Link href="#join" style={navLinkStyle}>Community</Link>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {/* Sign In targets the existing user session entrance */}
          <Link href="/login" style={navLinkStyle}>Sign In</Link>
          
          {/* FIXED: Get Started routes new users directly to the styled registration flow */}
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={purpleButtonStyle}>Get Started</button>
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
          <span style={{ color: "#a78bfa" }}>with AI</span>
        </h1>
        
        <p style={heroSubheadingStyle}>
          NotesTaker AI transforms chaotic source material into structured knowledge. 
          The high-fidelity workspace for deep focus and intellectual mastery.
        </p>
        
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "64px" }}>
          {/* FIXED: Pointed to registration flow first to establish user context before workspace ingestion */}
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={{ ...purpleButtonStyle, padding: "14px 28px", fontSize: "15px" }}>
              Start Learning Free
            </button>
          </Link>
          <Link href="#features" style={{ textDecoration: "none" }}>
            <button style={secondaryButtonStyle}>
              <span>▶</span> Watch Demo
            </button>
          </Link>
        </div>

        {/* Floating Product Mockup UI Frame */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold" }}>✦ NotesTaker AI</span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Workspace / <span style={{ color: "white" }}>Neural Biology 101</span></span>
            </div>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#6b7280" }}>
              <span>🔒 Secure</span>
            </div>
          </div>
          <div style={mockupBodyStyle}>
            <div style={mockupSidebarStyle}>
              <div style={sidebarItemActive}>▦ Dashboard</div>
              <div style={sidebarItemInactive}>📄 Notes</div>
              <div style={sidebarItemInactive}>▱ Flashcards</div>
            </div>
            <div style={mockupContentStyle}>
              <div style={synthesizingBoxStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span>⏳</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px" }}>
                      <span>Synthesizing: <b>Biology_Chapter_4.pdf</b></span>
                      <span style={{ color: "#a78bfa" }}>ANALYZING...</span>
                    </div>
                    <div style={{ width: "100%", height: "4px", backgroundColor: "#1f2937", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: "65%", height: "100%", backgroundColor: "#8b5cf6", borderRadius: "2px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "14px" }}>
                <div style={mockCardStyle}></div>
                <div style={mockCardStyle}></div>
              </div>
            </div>
            <div style={mockupInsightsStyle}>
              <p style={{ margin: "0 0 12px 0", fontSize: "11px", color: "#4b5563", fontWeight: "bold", letterSpacing: "0.5px" }}>AI INSIGHTS</p>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#1f2937", borderRadius: "4px", marginBottom: "12px" }}></div>
              <div style={{ width: "80%", height: "8px", backgroundColor: "#1f2937", borderRadius: "4px", marginBottom: "12px" }}></div>
              <div style={{ width: "90%", height: "8px", backgroundColor: "#1f2937", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={featuresSectionStyle}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "12px", letterSpacing: "-0.5px" }}>Powerful Study Workflows</h2>
          <p style={{ color: "#9ca3af", fontSize: "16px" }}>Everything you need to digest complex information in seconds, not hours.</p>
        </div>
        
        <div style={gridStyle}>
          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>📄</div>
            <h3 style={featureTitleStyle}>PDF to Interactive Notes</h3>
            <p style={featureDescriptionStyle}>Upload your textbooks and papers. NotesTaker AI extracts the core concepts, defines complex terms, and builds a clickable structure.</p>
            <div style={miniProgressBarStyle}>
              <div style={{ width: "45%", height: "100%", backgroundColor: "#8b5cf6" }}></div>
              <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "#6b7280" }}>ANALYZING...</span>
            </div>
          </div>

          <div style={featureCardStyle}>
            <div style={iconBoxStyle}>🎙️</div>
            <h3 style={featureTitleStyle}>Live Transcription</h3>
            <p style={featureDescriptionStyle}>Record lectures in real-time. Our AI captures nuances and tags key moments for later review.</p>
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "24px", marginTop: "auto", paddingLeft: "4px" }}>
              <div style={{ width: "3px", height: "12px", backgroundColor: "#8b5cf6" }}></div>
              <div style={{ width: "3px", height: "20px", backgroundColor: "#8b5cf6" }}></div>
              <div style={{ width: "3px", height: "14px", backgroundColor: "#8b5cf6" }}></div>
              <div style={{ width: "3px", height: "24px", backgroundColor: "#8b5cf6" }}></div>
              <div style={{ width: "3px", height: "10px", backgroundColor: "#8b5cf6" }}></div>
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
          <h2 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "12px" }}>Investment in Knowledge</h2>
          <p style={{ color: "#9ca3af", fontSize: "16px" }}>Simple pricing for lifelong learning.</p>
        </div>

        <div style={pricingGridStyle}>
          {/* Starter Plan */}
          <div style={pricingCardStyle}>
            <p style={planNameStyle}>STARTER</p>
            <h3 style={planPriceStyle}>$0 <span style={{ fontSize: "14px", color: "#6b7280" }}>/ forever</span></h3>
            <ul style={planFeatureListStyle}>
              <li>✓ 5 AI Credits / month</li>
              <li>✓ Standard Web Workspace</li>
              <li>✓ Up to 3 Study Folders</li>
            </ul>
            {/* FIXED: Directed starter acquisition cleanly into sign up sequence */}
            <Link href="/signup" style={{ textDecoration: "none", marginTop: "auto" }}>
              <button style={pricingButtonSecondaryStyle}>Get Started</button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div style={{ ...pricingCardStyle, border: "2px solid #8b5cf6", position: "relative" }}>
            <span style={premiumBadgeStyle}>MOST POPULAR</span>
            <p style={planNameStyle}>FORGE PRO</p>
            <h3 style={planPriceStyle}>$12 <span style={{ fontSize: "14px", color: "#6b7280" }}>/ month</span></h3>
            <ul style={planFeatureListStyle}>
              <li>✓ Unlimited AI Synthesis</li>
              <li>✓ Voice Recording + Sync</li>
              <li>✓ Unlimited Workspaces</li>
              <li>✓ Priority AI Processing</li>
            </ul>
            {/* FIXED: Directed premium conversions directly into registration logic */}
            <Link href="/signup" style={{ textDecoration: "none", marginTop: "auto" }}>
              <button style={pricingButtonActiveStyle}>Upgrade to Pro</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section id="join" style={ctaSectionStyle}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "12px" }}>Ready to sharpen your mind?</h2>
        <p style={{ color: "#9ca3af", fontSize: "15px", marginBottom: "32px", maxWidth: "540px", margin: "0 auto 32px auto" }}>
          NotesTaker AI transforms chaotic source material into structured knowledge. The high-fidelity workspace for deep focus and intellectual mastery.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", maxWidth: "400px", margin: "0 auto" }}>
          <input type="email" placeholder="Enter your email" style={ctaInputStyle} />
          <button style={purpleButtonStyle}>Get Invitation</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto", color: "#4b5563", fontSize: "13px" }}>
          <div>© 2026 NotesTaker AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <span>PRODUCT</span>
            <span>ABOUT</span>
            <span>PRICING</span>
            <span>TERMS</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

// --- High Fidelity Design Tokens & Styles ---
const pageStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#030303", color: "white", fontFamily: "'Urbanist', sans-serif" } as const;
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 64px", backgroundColor: "rgba(3,3,3,0.7)", backdropFilter: "blur(12px)", position: "sticky" as const, top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.03)" } as const;
const navLinkStyle = { color: "#9ca3af", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" } as const;

const heroStyle = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "100px 24px 0 24px", maxWidth: "1200px", margin: "0 auto" } as const;
const badgeStyle = { display: "inline-block", padding: "6px 14px", borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontSize: "11px", fontWeight: "700", marginBottom: "32px", letterSpacing: "1.5px" } as const;
const heroHeadingStyle = { fontSize: "68px", lineHeight: "1.1", margin: "0 0 24px 0", letterSpacing: "-2px", fontWeight: "800" } as const;
const heroSubheadingStyle = { fontSize: "19px", color: "#9ca3af", maxWidth: "620px", margin: "0 auto 40px auto", lineHeight: "1.6", fontWeight: "400" } as const;

const mockupContainerStyle = { width: "100%", maxWidth: "840px", backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px 14px 0 0", padding: "14px 14px 0 14px", boxShadow: "0 -25px 60px rgba(139, 92, 246, 0.08)" } as const;
const mockupHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px" } as const;
const mockupBodyStyle = { display: "grid", gridTemplateColumns: "160px 1fr 180px", minHeight: "260px", backgroundColor: "#030303" } as const;

const mockupSidebarStyle = { borderRight: "1px solid rgba(255,255,255,0.04)", padding: "16px 8px", display: "flex", flexDirection: "column" as const, gap: "10px" };
const sidebarItemActive = { padding: "6px 10px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.04)", fontSize: "12px", textAlign: "left" as const, color: "white" };
const sidebarItemInactive = { padding: "6px 10px", fontSize: "12px", textAlign: "left" as const, color: "#4b5563" };

const mockupContentStyle = { padding: "18px", display: "flex", flexDirection: "column" as const };
const mockupInsightsStyle = { borderLeft: "1px solid rgba(255,255,255,0.04)", padding: "18px", textAlign: "left" as const };

const synthesizingBoxStyle = { backgroundColor: "rgba(17,24,39,0.3)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "10px", padding: "14px", textAlign: "left" as const };
const mockCardStyle = { backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "8px", height: "90px" } as const;

const featuresSectionStyle = { padding: "120px 64px", backgroundColor: "#050505", borderTop: "1px solid rgba(255,255,255,0.03)" } as const;
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "24px", maxWidth: "1100px", margin: "0 auto" } as const;
const featureCardStyle = { backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "36px", display: "flex", flexDirection: "column" as const, position: "relative" as const, minHeight: "240px" };
const featureTitleStyle = { fontSize: "20px", marginBottom: "12px", fontWeight: "700", color: "white" } as const;
const featureDescriptionStyle = { color: "#71717a", margin: "0 0 24px 0", lineHeight: "1.6", fontSize: "14px" } as const;
const iconBoxStyle = { width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "20px" } as const;

const miniProgressBarStyle = { width: "100%", height: "32px", backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "8px", overflow: "hidden", position: "relative" as const, marginTop: "auto" };

const pricingSectionStyle = { padding: "100px 64px", backgroundColor: "#030303", borderTop: "1px solid rgba(255,255,255,0.03)" } as const;
const pricingGridStyle = { display: "flex", gap: "24px", justifyContent: "center", maxWidth: "800px", margin: "0 auto" } as const;
const pricingCardStyle = { flex: 1, backgroundColor: "#09090b", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column" as const, minHeight: "440px" };
const planNameStyle = { fontSize: "12px", fontWeight: "700", color: "#71717a", letterSpacing: "1px", margin: "0 0 16px 0" } as const;
const planPriceStyle = { fontSize: "42px", fontWeight: "800", color: "white", margin: "0 0 28px 0" } as const;
const planFeatureListStyle = { listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column" as const, gap: "14px", color: "#9ca3af", fontSize: "14px", textAlign: "left" as const };

const premiumBadgeStyle = { position: "absolute" as const, top: "-14px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#8b5cf6", color: "white", fontSize: "10px", fontWeight: "700", padding: "4px 12px", borderRadius: "12px", letterSpacing: "0.5px" };

const ctaSectionStyle = { padding: "120px 24px", backgroundColor: "#09090b", borderTop: "1px solid rgba(255,255,255,0.03)", textAlign: "center" as const } as const;
const ctaInputStyle = { padding: "14px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#030303", color: "white", outline: "none", fontSize: "14px", width: "260px" } as const;

const footerStyle = { padding: "40px 64px", backgroundColor: "#030303", borderTop: "1px solid rgba(255,255,255,0.03)" } as const;

const purpleButtonStyle = { backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontWeight: "600", cursor: "pointer", fontSize: "14px" } as const;
const secondaryButtonStyle = { backgroundColor: "transparent", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" } as const;
const pricingButtonActiveStyle = { width: "100%", backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontSize: "14px" } as const;
const pricingButtonSecondaryStyle = { width: "100%", backgroundColor: "rgba(255,255,255,0.02)", color: "white", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px", fontWeight: "600", cursor: "pointer", fontSize: "14px" } as const;