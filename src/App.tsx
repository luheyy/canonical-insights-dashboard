import { useMemo, useState } from "react";
import intelligenceData, {
  type SignalCard,
  type PulseItem,
  type TabData,
} from "./data/intelligenceData";

const ACTIVE_TABS = ["Ubuntu Platform", "IoT & Devices"] as const;
const LOCKED_TABS = ["Apps & Data", "Security", "Infrastructure"] as const;

type ActiveTab = (typeof ACTIVE_TABS)[number];

function useExecTime() {
  return useMemo(() => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }, []);
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

function TabView({
  data,
  execTime,
  onRefresh,
}: {
  data: TabData;
  execTime: string;
  onRefresh: () => void;
}) {
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
            <SignalCardView card={c} key={i} onRefresh={onRefresh} />
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
  const [error, setError] = useState<string | null>(null);
  const execTime = useExecTime();

  // Calls the SERVER-SIDE function (api/generate.ts). The API key never
  // touches the browser. If the function isn't ready or errors, we quietly
  // keep the built-in static content so the dashboard always works.
  async function generate(target: ActiveTab) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/generate?tab=${encodeURIComponent(target)}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = (await res.json()) as TabData;
      if (!data?.pulse || !data?.signals || !data?.pmm) {
        throw new Error("Unexpected response shape");
      }
      setAiData((prev) => ({ ...prev, [target]: data }));
    } catch (e: any) {
      setError(e?.message || "generation failed");
    } finally {
      setIsLoading(false);
    }
  }

  // Show live AI data if we have it for this tab, otherwise the static baseline.
  const activeData = aiData[tab] ?? intelligenceData[tab];
  const isLive = Boolean(aiData[tab]);

  return (
    <div className="app">
      {isLoading && <div className="ai-toast">Gemini generating fresh intelligence…</div>}
      {error && !isLoading && (
        <div className="ai-toast ai-toast-error">
          Live refresh unavailable — showing baseline
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
            Last exec <strong>{execTime}</strong>
            {isLive && <span className="live-badge">LIVE</span>}
          </span>
          <button
            className="refresh-all"
            type="button"
            onClick={() => generate(tab)}
            disabled={isLoading}
          >
            <BoltIcon />
            {isLoading ? "GENERATING…" : "REFRESH ALL"}
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
        <TabView data={activeData} execTime={execTime} onRefresh={() => generate(tab)} />
      </main>

      <footer className="foot">
        {isLive
          ? "Live intelligence generated by Gemini · via secure server-side function"
          : "Prototype · baseline intelligence · click Refresh All to generate live"}
      </footer>
    </div>
  );
}
