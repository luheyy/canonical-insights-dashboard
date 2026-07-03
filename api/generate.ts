import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  try {
    const tab = (req.query?.tab as string) || "Ubuntu Platform";
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

    const prompt = `You are a competitive-intelligence analyst for Canonical's PMM team.
Generate a fresh competitive brief for the "${tab}" tab of an Ubuntu competitive dashboard.
If "Ubuntu Platform": focus on desktop competitors (Windows 11, Fedora Workstation, Pop!_OS, Linux Mint, ChromeOS Flex).
If "IoT & Devices": focus on Wind River, Yocto, BalenaOS, Windows IoT, AWS/Azure IoT.
Return ONLY a minified JSON object, no markdown, matching exactly:
{"pulse":[{"competitor":"","freshness":"","move":"","impact":""}],"signals":[{"tag":"","isTrend":true,"sourceUrl":"","sourceDomain":"","sourceType":"","freshness":"","headline":"","ageDays":1,"highlights":[{"claim":"","breakdown":["",""]}]}],"pmm":{"header":"🎯 PORTFOLIO ACTION MOVE:","actions":["",""]}}`;

    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = (r.text || "").replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "generation failed" });
  }
}
