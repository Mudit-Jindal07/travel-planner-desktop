# ✈️ Travel Planner Desktop

> *Live your life by a compass, not a clock.*

A small Electron desktop app for planning trips. Built for a college minor project on Desktop Application Development. The app stays out of your way: pick a destination, set a budget, and it generates a day-by-day plan with a budget breakdown and packing checklist. Save it, reopen it later, delete it when you're back.

---

## 🌍 What it does

- **Plan a trip** in one form: destination, days, budget, interests
- **Auto-generates an itinerary**: 3 activities per day (morning, afternoon, evening), cycling through a curated list per city
- **Budget breakdown**: a 5-segment colored bar (accommodation, food, transport, sightseeing, misc) plus a category list with amounts
- **Packing checklist**: 5 common items plus 2 destination-specific ones, with tick-off state that persists
- **Save / open / delete trips**: stored as `trips.json` in Electron's per-user data folder, survives restarts
- **6 sample destinations**: Jaipur, Goa, Manali, Kerala, Tokyo, Paris

---

## 🛠 Tech stack

- **Electron** (main + renderer + preload)
- **JS** in the renderer
- **Plain CSS**
- **IPC + contextBridge** for the preload bridge
- **electron-builder** for DMG packaging

---

## 🚀 Getting started

```bash
git clone https://github.com/Mudit-Jindal07/travel-planner-desktop.git
cd travel-planner-desktop
npm install
npm start
```

The app window opens at 1200×800 with a fixed sidebar and a dashboard.

---

## 📦 Build a DMG (macOS)

```bash
npm run dist
```

Output lands in `dist/Travel Planner-1.0.0.dmg`. The DMG uses the standard drag-to-Applications layout.

The app is **not code-signed**. On first launch macOS will say "Travel Planner cannot be opened because the developer cannot be verified." To bypass: right-click the app → **Open** → **Open** in the dialog. After the first launch it opens normally.

---

## 📁 Project structure

```
travel-planner-desktop/
├── main.js         Electron main process (window, IPC handlers, fs)
├── preload.js      Secure bridge: exposes loadTrips + saveTrips only
├── renderer.js     UI state + render functions + event handlers
├── index.html      App shell (sidebar + 4 views)
├── styles.css      All styling, plain CSS with CSS variables
├── package.json    Scripts + electron-builder config
└── readme.md       This file
```

---

## 🗺 Progress

What's done so far, in rough order:

- [x] Electron window with proper lifecycle (whenReady, window-all-closed, activate)
- [x] Sidebar navigation + dashboard view
- [x] Create trip form with validation
- [x] Day-by-day itinerary generation (modulo cycling through sample activities)
- [x] Budget breakdown with multi-color segment bar
- [x] Packing checklist with persistent checkbox state
- [x] Preload bridge + IPC handlers for trips:load and trips:save
- [x] Save trip to disk (creates or updates trips.json)
- [x] Load saved trips on startup
- [x] Saved trips list view (cards with Open + Delete)
- [x] UI polish: hover lifts, fadeIn animation on view switch, focus rings
- [x] Code cleanup pass (removed devTools flag, dialog handler, minWidth/minHeight)
- [x] Humanized comments (file headers + inline notes only where the why isn't obvious)
- [x] DMG build config via electron-builder

---

## 📝 Notes

- Trips persist to `trips.json` in Electron's `userData` folder:
  - macOS: `~/Library/Application Support/travel-planner-desktop/trips.json`
  - Windows: `%APPDATA%\travel-planner-desktop\trips.json`
  - Linux: `~/.config/travel-planner-desktop/trips.json`
- Budget percentages are static estimates (40/25/15/12/8). Not live prices. The UI calls them out as estimates.
- Sample activities per destination are hardcoded in `DESTINATION_ACTIVITIES` in renderer.js. Swap them freely.

---

> *Not all who wander are lost.* - J.R.R. Tolkien

Built by **Mudit Jindal** for a college minor project.
