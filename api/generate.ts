import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  try {
    const tab = (req.query?.tab as string) || "Ubuntu Platform";
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY" });

    const ai = new GoogleGenAI({ apiKey: key });

    const prompt = `You are a competitive-intelligence analyst for Canonical's PMM team.
Generate a fresh competitive brief for the "${tab}" tab of an Ubuntu competitive dashboard.
If "Ubuntu Platform": focus on desktop competitors (Windows 11, Fedora Workstation, Pop!_OS, Linux Mint, ChromeOS Flex).
If "IoT & Devices": focus on Wind River, Yocto, BalenaOS, Windows IoT, AWS/Azure IoT.

IMPORTANT RULES:
- Frame every item as a CURRENT development. Do NOT use any calendar year or month (no "2024", no "May 2024"). 
- For every "freshness" field, use ONLY a relative recency label such as "Today", "2 days ago", "This week", or "5 days ago" — nothing older than 7 days.
- Keep each competitor's angle plausible and tied to why it matters for Ubuntu.

Output ONLY raw JSON, no markdown, no commentary, matching exactly this shape:
{"pulse":[{"competitor":"","freshness":"","move":"","impact":""}],"signals":[{"tag":"","isTrend":false,"sourceUrl":"","sourceDomain":"","sourceType":"","freshness":"","headline":"","ageDays":1,"highlights":[{"claim":"","breakdown":["",""]}]}],"pmm":{"header":"🎯 PORTFOLIO ACTION MOVE:","actions":["",""]}}
Include 4 pulse items and 4 signals. Set ageDays between 0 and 6.`;

    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
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
