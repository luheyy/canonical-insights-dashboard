import { useMemo, useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import intelligenceData, {
  type SignalCard,
  type PulseItem,
  type TabData,
} from "./data/intelligenceData";

// Initialize the Gemini Client utilizing your secure Vercel environment variable
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
});

const ACTIVE_TABS = ["Ubuntu Platform", "IoT & Devices"] as const;
const LOCKED_TABS = ["Apps & Data", "Security", "Infrastructure"] as const;

type ActiveTab = (typeof ACTIVE_TABS)[number];

function useExecTime() {
  const [currentTime, setCurrentTime] = useState("");
  
  useEffect(() => {
    const formatTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    setCurrentTime(formatTime());
  }, []);

  return currentTime;
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11A8 8 0 0 0 6.3 6.3L4 8m0 0V4m0 4h4m-4 5a8 8 0 0 0 13.7 4.7L20 16m0 0v4m0-4h-4"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path fill="currentColor" d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" className="lock">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 10V8a6 6 0 0 1 12 0v2m-13 0h14v10H5z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" className="ext">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17 17 7m0 0H8m9 0v9"
      />
    </svg>
  );
}

function PulseCard({ item }: { item: PulseItem }) {
  return (
    <div className="pulse-card">
      <div className="pulse-head">
        <span className="pulse-competitor">{item.competitor}</span>
        <span className="freshness">{item.freshness}</span>
      </div>
      <div className="pulse-move">{item.move}</div>
      <div className="pulse-impact">
        <span className="why">Why it matters:</span> {item.impact}
      </div>
    </div>
  );
}

function SignalCardView({ card, onRefresh }: { card: SignalCard; onRefresh: () => void }) {
  return (
    <div className="signal-card">
      <div className="signal-top">
        <span className={"tag" + (card.isTrend ? " tag-trend" : "")}>{card.tag}</span>
        <a className="source" href={card.sourceUrl} target="_blank" rel="noreferrer">
          {card.sourceDomain}
          <ExternalIcon />
        </a>
      </div>
      <div className="signal-meta">
        <span className="source-type">{card.sourceType}</span>
        <span className="dot-sep">·</span>
        <span className="freshness">{card.freshness}</span>
      </div>
      <h3 className="signal-headline">{card.headline}</h3>
      <div className="highlights">
        {card.highlights.map((h, i) => (
          <div className="highlight" key={i}>
            <div className="claim">
              <span className="claim-dot" />
              <span>{h.claim}</span>
            </div>
            <ul className="breakdown">
              {h.breakdown.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <button className="refresh-btn" type="button" onClick={onRefresh}>
          <RefreshIcon />
          Refresh
        </button>
      </div>
    </div>
  );
}

function TabView({ data, execTime, onCardRefresh }: { data: TabData; execTime: string; onCardRefresh: () => void }) {
  const sortedSignals = [...data.signals].sort((a, b) => a.ageDays - b.ageDays);

  return (
    <>
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">
            <span className="eyebrow-icon">↗</span> MARKET PULSE
          </span>
          <span className="section-meta">{data.pulse.length} moves · last 7 days</span>
        </div>
        <div className="pulse-grid">
          {data.pulse.map((p, i) => (
            <PulseCard item={p} key={i} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="eyebrow">QUALITATIVE INTELLIGENCE</span>
          <span className="section-meta">
            {data.signals.length} signals · {execTime}
          </span>
        </div>
        <h2 className="section-title">Competitive Signal Feed</h2>
        <div className="signal-grid">
          {sortedSignals.map((c, i) => (
            <SignalCardView card={c} key={i} onRefresh={onCardRefresh} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="pmm-card">
          <div className="pmm-header">
            <span className="pmm-bulb">💡</span> CANONICAL PRODUCT MARKETING MANAGEMENT (PMM)
            RECOMMENDATIONS
          </div>
          <div className="pmm-move">{data.pmm.header}</div>
          <ul className="pmm-actions">
            {data.pmm.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState<ActiveTab>("Ubuntu Platform");
  const [aiData, setAiData] = useState<Record<ActiveTab, TabData | null>>({
    "Ubuntu Platform": null,
    "IoT & Devices": null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [displayTime, setDisplayTime] = useState("10:53:03");
  const systemTime = useExecTime();

  // Unified dynamic insight generator connecting directly to Gemini
  const fetchAiIntelligence = async (targetTab: ActiveTab) => {
    setIsLoading(true);
    try {
      // 1. Ingest raw core text file directly from your repository asset layer
      const kbUrl = "https://raw.githubusercontent.com/luheyy/canonical-insights-hub/main/knowledge-base.txt";
      const response = await fetch(kbUrl);
      if (!response.ok) throw new Error("Knowledge base asset unreachable");
      const knowledgeBaseText = await response.text();

      // 2. Transmit prompt instruction to Gemini 2.5 Flash
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          You are an expert Competitive Intelligence Analyst for Canonical's Product Marketing Management (PMM) team.
          Analyze this tracking knowledge base: "${knowledgeBaseText}".
          
          Generate context targeting the active tracking tab: "${targetTab}".
          - If the tab is "Ubuntu Platform", pull insights from core spaces, cloud virtualization shifts (VMware core TCO shifts), WSL/Active Directory controls, and Multipass utilities.
          - If the tab is "IoT & Devices", isolate elements from Module 5 (Ubuntu Core, read-only immutability, Yocto/Buildroot patch gaps, over-the-air safe rollbacks, 2026 Cyber Resilience Act compliance, RISC-V targets).
          
          Return your parsing result as a clean, single minified JSON object matching this structure precisely. Do not enclose the output inside markdown blocks:
          {
            "pulse": [
              { "competitor": "STRING", "freshness": "STRING", "move": "STRING", "impact": "STRING" }
            ],
            "signals": [
              {
                "tag": "STRING",
                "isTrend": true,
                "sourceUrl": "STRING",
                "sourceDomain": "STRING",
                "sourceType": "STRING",
                "freshness": "STRING",
                "headline": "STRING",
                "ageDays": 1,
                "highlights": [
                  { "claim": "STRING", "breakdown": ["STRING", "STRING"] }
                ]
              }
            ],
            "pmm": {
              "header": "STRING",
              "actions": ["STRING", "STRING"]
            }
          }
        `,
      });

      // 3. Clean and parse generative payload into structural dashboard context
      const cleanText = aiResponse.text.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanText) as TabData;
      
      setAiData(prev => ({ ...prev, [targetTab]: parsedData }));
      if (systemTime) setDisplayTime(systemTime);
    } catch (error) {
      console.error("AI Generation Fallback Triggered:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run generation automatically when mounting or switching tabs
  useEffect(() => {
    if (!aiData[tab]) {
      fetchAiIntelligence(tab);
    }
  }, [tab]);

  // Handle local fallback context fallback gracefully
  const activeData = aiData[tab] || intelligenceData[tab];

  return (
    <div className={`app ${isLoading ? "opacity-60 pointer-events-none transition-opacity" : ""}`}>
      {isLoading && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 1000,
          background: '#E95420', color: 'white', padding: '6px 12px',
          borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace',
          fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          ⏳ GEMINI SYNCHRONIZING PIPELINES...
        </div>
      )}

      <header className="topbar">
        <div className="brand">
          <span className="u-badge">U</span>
          <span className="brand-title">Ubuntu Competitive Dashboard</span>
        </div>
        <div className="topbar-right">
          <span className="exec-pill">
            <span className="exec-dot" />
            Last exec <strong>{displayTime}</strong>
          </span>
          <button 
            className="refresh-all" 
            type="button" 
            onClick={() => fetchAiIntelligence(tab)}
            disabled={isLoading}
          >
            <BoltIcon />
            REFRESH ALL
          </button>
        </div>
      </header>

      <nav className="tabs" role="tablist">
        {ACTIVE_TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={"tab" + (tab === t ? " tab-active" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        {LOCKED_TABS.map((t) => (
          <span key={t} className="tab tab-locked" aria-disabled="true">
            {t} <LockIcon />
          </span>
        ))}
      </nav>

      <main className="content">
        <TabView data={activeData} execTime={displayTime} onCardRefresh={() => fetchAiIntelligence(tab)} />
      </main>

      <footer className="foot">
        Prototype · powered by Gemini Live API Ingestion · source context: knowledge-base.txt
      </footer>
    </div>
  );
}
