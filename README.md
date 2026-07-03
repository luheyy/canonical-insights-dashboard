# Ubuntu Insights Hub

A competitive-intelligence dashboard for Canonical (Ubuntu Platform + IoT & Devices).
Plain **Vite + React + TypeScript** — no server, no framework, deploys to Vercel with zero config.

## Where the content lives

All headlines, cards, and recommendations are in **one file**:

```
src/data/intelligenceData.ts
```

To change any text, open that file, edit the string, save. That's it. No build tools
to understand, no other files to touch.

## Run it on your computer (optional)

You need Node.js 18+ installed. Then:

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## Deploy to Vercel (three steps)

1. Put this folder in a GitHub repo (your own GitHub — nothing to do with Lovable):
   - Create a new empty repo on github.com.
   - Follow GitHub's "push an existing folder" commands, OR drag-and-drop upload the files.
2. Go to vercel.com → **Add New → Project** → import that repo.
3. Vercel auto-detects Vite. Leave everything default and click **Deploy**.

After that, every change you push to GitHub redeploys automatically. Editing a card =
edit `intelligenceData.ts` → commit → live in ~30 seconds. No credits, ever.

## Notes

- Content is representative/illustrative for a prototype. Timestamps are placeholders.
- The "Ubuntu Platform" tab is aimed at desktop competitors (Windows 11, Fedora
  Workstation, Pop!_OS, Linux Mint, ChromeOS Flex). The "IoT & Devices" tab covers
  embedded/edge competitors.
