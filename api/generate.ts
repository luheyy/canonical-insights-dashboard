import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

type TabName = "Ubuntu Platform" | "IoT & Devices" | "Security" | "Infrastructure" | "Apps & Data";

type TabProfile = {
  productsInScope: string;
  competitors: string;
  buyerAudience: string;
  battlegrounds: string;
  sourcesToWatch: string;
  claimsToFlag: string;
};

// Sourced from Canonical's "Scoping for Competitive Intel Dashboard" sheet.
// IoT & Devices folds in Golioth's competitor set (Particle, Blues Wireless,
// ClearBlade, Blynk, DIY) — Golioth itself is a Canonical product, so it is
// never surfaced by name as a rival.
const TAB_PROFILES: Record<TabName, TabProfile> = {
  "Ubuntu Platform": {
    productsInScope: "Ubuntu Desktop, Ubuntu Server, Ubuntu on WSL, Workshop",
    competitors:
      "Windows 11, macOS, ChromeOS / ChromeOS Flex, Red Hat Enterprise Linux, SUSE Linux Enterprise, Red Hat Desktop, Linux Mint, Fedora Workstation, Pop!_OS, Docker / Dev Containers, OpenSandbox",
    buyerAudience:
      "Primary: IT Admin. Users: app developers, data scientists, ML engineers. Influencers: DevOps. Gatekeepers: Security.",
    battlegrounds:
      "1) Preferred developer platform, 2) integration into existing fleets, 3) managed, secured, and supported desktop.",
    sourcesToWatch:
      "The Register, Phoronix, ZDNet, OMGUbuntu, Hacker News, competitor blogs, Linux/IT-admin Reddit (r/sysadmin, r/linux)",
    claimsToFlag:
      '"best Linux distro for enterprise", "best enterprise development environment", managed-desktop / fleet-management parity claims, pricing or licensing changes',
  },
  "IoT & Devices": {
    productsInScope:
      "Ubuntu Core, snaps / Snapcraft / Snap Store, Landscape (fleet management), Ubuntu Pro for Devices, RISC-V, KernOS, Kernel Factory, Zephyr LTS",
    competitors:
      "Wind River Linux / VxWorks, Yocto Project / OpenEmbedded (DIY builds), BalenaOS, Microsoft Windows IoT Enterprise LTSC, AWS IoT Greengrass, Azure IoT Edge / IoT Operations, SUSE Edge, Torizon (Toradex), FreeRTOS, Eclipse ThreadX, QNX, Flathub / Flatpak, Particle, Blues Wireless, ClearBlade, Blynk, and general DIY / custom-built device-connectivity stacks",
    buyerAudience:
      "Primary: ODM/OEM device-maker and integrator engineering leads (embedded architects, VP Eng) choosing a base OS or connectivity stack for a product line. Secondary: field ops teams running deployed fleets, systems integrators. Compliance-adjacent: security leads facing CRA obligations. Often bottom-up — hardware/mechanical/firmware engineers trigger the buyer conversation; founders and department heads decide.",
    battlegrounds:
      "1) Update mechanics & lifecycle, 2) engineering cost of a bespoke OS, 3) compliance & supply chain — plus connectivity (CoAP, cellular, wifi, bluetooth), OTA / device security, and fleet management.",
    sourcesToWatch:
      "CNX Software, LWN.net, Hackster.io, IoT Tech News, IoT Business News, The Register, Yocto/OpenEmbedded mailing lists, vendor blogs (Wind River, balena, AWS IoT, Microsoft IoT docs), Reddit (r/embedded, r/IOT, r/yocto), Hacker News",
    claimsToFlag:
      'long-term support parity ("10-year", "LTS") claims, safety-certification credentials, atomic/rollback update parity, CRA-compliance stories, subscription or per-device pricing changes, no-vendor-lock-in claims, secure-OTA-from-day-one claims, firmware SDK claims',
  },
  Security: {
    productsInScope: "ESM, Livepatch, Landscape",
    competitors: "Red Hat, Chainguard",
    buyerAudience:
      "Primary: platform engineering, IT system admin, security engineering, CISO. Secondary: CIO, CTO, developers.",
    battlegrounds:
      "1) Open source security patching, 2) managing the Linux estate, 3) open source support & compliance.",
    sourcesToWatch:
      "The Register, Phoronix, ZDNet, OMGUbuntu, Hacker News, computerweekly.com, thenextweb.com, thehackernews.com, securityweek.com, competitor blogs/press releases/LinkedIn and social accounts",
    claimsToFlag:
      '"open source security automation", "find and fix vulnerabilities", "security patching automation", "best open source support", "most secure enterprise linux"',
  },
  Infrastructure: {
    productsInScope: "Canonical MicroCloud, Canonical OpenStack, Canonical K8s, Canonical MAAS, Canonical Ceph",
    competitors:
      "Primary: Red Hat OpenShift, Red Hat OpenStack, VMware VCF, VMware vSphere, Red Hat Satellite, Nutanix AHV, Proxmox VE, SUSE Rancher/Harvester. Secondary/niche: Whitestack, OpenNebula, Mirantis, Wind River.",
    buyerAudience:
      "Platform engineering and IT operations teams standardizing private-cloud, virtualization, and Kubernetes infrastructure.",
    battlegrounds:
      "Vendor lock-in vs. openness, total cost of ownership vs. incumbent virtualization stacks, and migration paths off VMware/Red Hat.",
    sourcesToWatch:
      "The Register, Phoronix, ZDNet, OMGUbuntu, Hacker News, vendor blogs (Red Hat, SUSE, VMware, Nutanix, Proxmox, Mirantis, OpenNebula, Whitestack), Reddit (r/sysadmin, r/homelab, r/proxmox, r/virtualization, r/vmware)",
    claimsToFlag:
      "no-vendor-lock-in claims (especially from SUSE, Red Hat), cost-economics claims, feature-update announcements, launch or partnership press releases",
  },
  "Apps & Data": {
    productsInScope: "Canonical's open source database, AI infrastructure, and data-platform offerings",
    competitors:
      "Open source database, AI-infrastructure, and MLOps vendors relevant to the battlegrounds below (e.g. HPC/AI orchestration players such as Slurm / AWS ParallelCluster where genuinely newsworthy) — do not force a fixed competitor list if nothing credible surfaces in the search window",
    buyerAudience:
      "Primary: executives (CTO, CIO, VP), architects (cloud, IT, DevOps, database), engineers (database, AI/ML). Secondary: DBAs, SREs, full-stack developers, data scientists.",
    battlegrounds:
      "1) Open source database software, support, and services, 2) open source AI infrastructure / private cloud for AI, 3) OS for AI.",
    sourcesToWatch:
      "The Register, Phoronix, ZDNet, OMGUbuntu, Hacker News, competitor websites (blog posts, press releases), LinkedIn newsletters and social accounts",
    claimsToFlag:
      '"open source database software, support and services", "best OS for AI", "end to end stack integration", "no vendor lock in", "zero ops alternative", "unified security and compliance", "cloud native supercomputing", "unified ai and data platform", "kubeflow alternative", "gain control over your TCO", "transparent pricing", "no licence fees", "One integrated stack for AI", "AI at speed"',
  },
};

export default async function handler(req: any, res: any) {
  try {
    const tab = (req.query?.tab as TabName) || "Ubuntu Platform";
    const profile = TAB_PROFILES[tab];
    if (!profile) {
      return res.status(400).json({ error: `Unknown tab "${tab}"` });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const ai = new GoogleGenAI({ apiKey: key });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startTime = weekAgo.toISOString();
    const endTime = now.toISOString();

    const prompt = `You are a competitive-intelligence analyst for Canonical's PMM team, building the "${tab}" tab of an Ubuntu competitive dashboard.

PORTFOLIO CONTEXT (Canonical's scope on this tab):
- Products in scope: ${profile.productsInScope}
- Competitors to track: ${profile.competitors}
- Buyer / audience: ${profile.buyerAudience}
- Top battlegrounds: ${profile.battlegrounds}
- Sources to watch: ${profile.sourcesToWatch}
- Competitive claims to auto-flag if seen: ${profile.claimsToFlag}

GROUNDING RULES — these override anything you think you already know:
- Your Google Search tool is restricted to results published between ${startTime} and ${endTime}. Base every item ONLY on what that search actually returns for that window.
- Do NOT invent a specific event, statistic, quote, or dated announcement that isn't backed by a real search result from that window. If you cannot find real recent news for a competitor on the list, write a lower-key item framed around its known ongoing positioning instead of fabricating a "just announced" specific.
- Never state or imply a calendar year or month (no "2024", no "May"). For every "freshness" field, use ONLY a relative recency label such as "Today", "2 days ago", "This week", or "5 days ago" — nothing older than 7 days.
- For "signals", sourceUrl and sourceDomain must be the REAL url/domain of the search result you used — never fabricate a plausible-looking URL.
- Keep each competitor's angle plausible and tied to why it matters for Ubuntu, using the battlegrounds and buyer context above.

Output ONLY raw JSON, no markdown, no commentary, matching exactly this shape:
{"pulse":[{"competitor":"","freshness":"","move":"","impact":""}],"signals":[{"tag":"","isTrend":false,"sourceUrl":"","sourceDomain":"","sourceType":"","freshness":"","headline":"","ageDays":1,"highlights":[{"claim":"","breakdown":["",""]}]}],"pmm":{"header":"🎯 PORTFOLIO ACTION MOVE:","actions":["",""]}}
Include 4 pulse items and 4 signals, drawn from distinct competitors in the list above where possible. Set ageDays between 0 and 6.`;

    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [
          {
            googleSearch: {
              timeRangeFilter: { startTime, endTime },
            },
          },
        ],
      },
    });

    const raw = r.text || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return res.status(502).json({ error: "No JSON in model output", raw: raw.slice(0, 300) });
    }
    const data = JSON.parse(raw.slice(start, end + 1));
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "generation failed" });
  }
}
