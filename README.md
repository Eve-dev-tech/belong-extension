# 🌿 Belong — Workplace Wellbeing Chrome Extension

**Version:** 1.0.0  
**Manifest:** V3  
**Data:** 100% local — nothing leaves your browser

---

## Installation (Developer Mode)

1. Unzip this package
2. Open Chrome → navigate to `chrome://extensions`
3. Toggle **Developer mode** ON (top-right)
4. Click **Load unpacked**
5. Select the `belong-extension` folder
6. Pin the Belong icon to your toolbar 📌

---

## File Structure

```
belong-extension/
├── manifest.json
├── _background/service-worker.js   ← time tracking, alarms, points
├── _newtab/index.html              ← new tab override (main UI)
├── onboarding/index.html           ← first-run setup
├── popup/popup.html                ← extension icon popup
├── features/
│   ├── breathing/breathing.js      ← Box, 4-7-8, 7-11 techniques
│   ├── exercises/exercises.js      ← 6 desk exercises
│   ├── breaks/breaks.js            ← break reminder scheduler
│   └── focus/focus.js              ← pomodoro focus timer
├── shared/
│   ├── storage.js                  ← chrome.storage wrapper
│   └── belong.css                  ← design system
└── assets/icons/                   ← extension icons
```

---

## Architecture Notes

- **No ES modules** — all JS uses IIFE pattern; safe for MV3 CSP
- **No build step required** — load unpacked and it works
- **Storage** — `chrome.storage.local` only; never `localStorage`
- **Service worker** — uses `importScripts()` for storage module
- **Fonts** — loaded via Google Fonts CDN (allowed in CSP)

---

## Replacing Icons

Replace the `.png` files in `assets/icons/` with your own:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px  
- `icon128.png` — 128×128 px (Chrome Web Store)

Use the sage green brand colour: **#6B9E78**
