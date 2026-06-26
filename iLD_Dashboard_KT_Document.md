# iLD Dashboard — Knowledge Transfer Document

**Project:** Quarterly Learning & Development Dashboard
**Platform:** Google Apps Script Web App
**Audience:** Developers, L&D Team, HRBPs, System Admins
**Last Updated:** June 2026

---

## Table of Contents

1. [What This Is](#1-what-this-is)
2. [Technology Stack](#2-technology-stack)
3. [File Structure](#3-file-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Google Sheets Structure Required](#5-google-sheets-structure-required)
6. [Backend Reference — code.gs](#6-backend-reference--codegs)
7. [Frontend Reference — Index.html](#7-frontend-reference--indexhtml)
8. [Configuration Guide for Developers](#8-configuration-guide-for-developers)
9. [How to Add a New Pillar](#9-how-to-add-a-new-pillar)
10. [How to Deploy / Publish](#10-how-to-deploy--publish)
11. [How to Update the Web App After Code Changes](#11-how-to-update-the-web-app-after-code-changes)
12. [User Guide — HRBPs & Leaders](#12-user-guide--hrbps--leaders)
13. [Metric Definitions & Calculations](#13-metric-definitions--calculations)
14. [Troubleshooting](#14-troubleshooting)
15. [Known Limitations & Pending Work](#15-known-limitations--pending-work)
16. [Appendix — Colour Reference](#appendix--colour-reference)

---

## 1. What This Is

The **iLD Dashboard** is an internal Learning & Development analytics web application. It is served via **Google Apps Script** (no separate server or hosting required) and reads data directly from **Google Sheets**.

It gives HRBPs and Leaders a single view of:
- Quarterly training metrics (Learner Count, Unique Learners, Total Hours, Average Hours)
- Q1 vs Q2 comparison with percentage delta
- Per-pillar program breakdown across 8 strategic streams
- BI drilldown console with 8 filter dimensions and 4 interactive charts
- CSV export of any filtered dataset

---

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | Google Apps Script (JavaScript ES6) | Reads from Google Sheets, serves HTML |
| Frontend | HTML + Tailwind CSS + Google Charts | Rendered inside Apps Script HtmlService |
| Data Source | Google Sheets (`MIS Base` tab) | One master sheet + per-pillar sheets |
| Hosting | Google Apps Script Web App URL | No AWS / GCP / external server needed |
| Version Control | GitHub (`Vicky-am96/iLD-Dashboard`) | Manual copy to Apps Script editor |
| Charts | Google Visualization API (corechart) | ColumnChart, BarChart |
| Styling | Tailwind CSS (CDN) + Inter font (Google Fonts) | No build step needed |

---

## 3. File Structure

```
iLD Dashboard/
├── code.gs                  Backend — all server-side logic and config
├── Index.html               Main dashboard HTML (all 3 views in one file)
├── Pillar_ECD.html          Navigation card — Early Career Development
├── Pillar_EMACH.html        Navigation card — eMACH Academy
├── Pillar_PF.html           Navigation card — PF Academy
├── Pillar_Skill.html        Navigation card — Skill Development
├── Pillar_Managerial.html   Navigation card — Managerial Development
├── Pillar_Leadership.html   Navigation card — Leadership Development
└── Pillat_Testimonial.html  Navigation card — Voice of Associates
```

> **Note on Pillar files:** These are legacy card HTML files included server-side. All card rendering is now handled dynamically in JavaScript from `DASHBOARD_CONFIG`. These files still exist as fallback server-side includes but the JS-rendered cards take precedence on load.

---

## 4. Architecture & Data Flow

### System Overview

```
User Browser
    │
    │  (opens web app URL)
    ▼
Google Apps Script Web App
    │  doGet() → serves Index.html
    ▼
Index.html (rendered in browser)
    │
    ├─► getDashboardMetadata()     → DASHBOARD_CONFIG → renders pillar cards
    ├─► getLiveDashboardSummary()  → MIS Base sheet   → renders 4 KPI cards + matrix
    │
    │  (user clicks a KPI card or pillar card)
    │
    └─► getMetricDrilldownData()   → MIS Base sheet → cached in browser memory
            │
            └─► All filter / chart logic runs CLIENT-SIDE on cached data
                 (no further server calls until the page is refreshed)
```

### Three Views in Index.html

The entire page lives in one HTML file. Three `<div>` sections are toggled visible/hidden using the Tailwind `hidden` class:

| View ID | Triggered By | Content |
|---|---|---|
| `homepage-view` | Default on page load | 4 KPI cards, Q1/Q2 matrix, 8 pillar cards |
| `metric-drilldown-view` | Clicking any KPI card | 8 filter dropdowns, 4 charts, KPI mini-cards, CSV export |
| `drilldown-view` | Clicking any pillar card | Sub-program tabs, learner metrics, data table |

### Caching Strategy

| Variable | Filled When | Purpose |
|---|---|---|
| `globalMetadata` | Page load | Pillar config — used to render cards and tabs |
| `computedSummaryCache` | Page load | Q1/Q2 summary — sets active quarter filter default |
| `globalRawLedgerRows` | First KPI click OR first pillar click | Full MIS ledger — all filtering done in-memory |
| `currentlyFilteredSubsetCache` | Every filter change | Current visible subset — used for CSV export and chart rendering |

---

## 5. Google Sheets Structure Required

### Master MIS Sheet

Controlled by `MASTER_METRICS_SHEET_ID` in `code.gs`.

The tab inside that sheet must be named exactly: **`MIS Base`**

The backend uses **header name matching** (not fixed column positions), so column order can change freely. Row 1 must contain these header names:

| Header Name (Row 1) | Used For |
|---|---|
| `Attendance Status` | All KPI calculations exclude absent rows |
| `Quarter` or `Quarter Detail` | Quarter grouping — normalised to Q1/Q2 |
| `EMPID` or `Employee ID` | Unique learner count |
| `Total Training Hours` or `Training Hours` | TLH and ALH calculations |
| `Month` | Month filter dropdown |
| `Type of Training` | TOT filter dropdown |
| `Schools` | Schools filter dropdown |
| `Program Name` | Program filter + pillar tab matching |
| `Course Name` | Course filter dropdown |
| `GRADE SERIES` | Grade filter + grade attendance chart |
| `LOB` | LOB filter + LOB attendance chart |
| `Product Line` | Included in CSV export |
| `Training Mode` | Mode of learning chart |
| `NAME` | Participant name in pillar detail table |

> **Fallback behaviour:** If a header is not found by name, the backend falls back to a hardcoded column index. Always ensure header names match exactly to avoid silent data errors.

### Attendance Status Values

Only rows where `Attendance Status` = **`present`** (case-insensitive) are counted in KPI calculations.

### Quarter Column Values

Accepted formats: `Q1`, `Q2`, `Q1 Detail`, `Q2 Detail`, or any string containing "Q1"/"Q2". The backend normalises all of these to `"Q1"` or `"Q2"`.

---

## 6. Backend Reference — code.gs

### DASHBOARD_CONFIG (top of file)

The **single source of truth** for all 8 pillars. Every field is consumed by the frontend `renderPillarCards()` function.

```javascript
"Pillar Display Name": {
  id: "GOOGLE_SHEET_ID",           // Spreadsheet ID from the sheet's URL
  tabs: ["Track 1", "Track 2"],    // Sub-program tabs shown in pillar detail view
  color: "#21552F",                // Card top border colour + badge background
  accent: "#AE7F2E",               // Footer text colour on the card
  streamLabel: "Strategic Stream 01", // Badge text shown on the card
  description: "One-line description shown on the card."
}
```

**Current pillars and their Sheet IDs:**

| Pillar | Sheet ID |
|---|---|
| Early Career Development | `1xygMOiZrXKV7NGMhLoIk3UVtFsvkYmXd1vnokjFQA5Y` |
| eMACH Academy | `1GC3NVsacRGAWVfdnfbV4FJo-22hrWrjlq8c7NydTIDU` |
| PF Academy (Purple Fabric Academy) | `12N5iwPYpuePzFE30M2AP6G73nbxJjqHQOn9lvbZm-NQ` |
| Skill Development | `1hHVpxUaoL1VIBLymVCxEQSD9_Z4wkpf_nvbqB_hLwx8` |
| Managerial Development | `1Pggj0ErPQRVuNUngynD30xQOAzHT2oDCXBOEpOV9HOg` |
| Leadership Development | `1flFSZtPfhvn9IyOQEwBhRNUtlz4z3D4HHuJEvJZSiI8` |
| Voice of Associates (Testimonials) | ⚠️ Placeholder — needs real ID |
| L&D PF Digital Experts & Web Apps | ⚠️ Placeholder — needs real ID |

### MASTER_METRICS_SHEET_ID

```javascript
const MASTER_METRICS_SHEET_ID = "1oE5VoNuJ8o21pqLSeTKVyyUUF4uilDWMxpWPOU6S-ig";
```

This single sheet powers the homepage KPI cards, comparison matrix, drilldown filters, and all 4 charts. Currently points to the Early Career Development sheet.

---

### Backend Function Reference

#### `doGet()`
- Serves `Index.html` as the web app page.
- Sets the page title and allows iframe embedding.
- Called every time someone opens the web app URL.

#### `include(filename)`
- Server-side utility — embeds a named HTML file's content at render time.
- Used via `<?!= include('Pillar_ECD'); ?>` in Index.html (legacy).

#### `getDashboardMetadata()`
- Returns the full `DASHBOARD_CONFIG` object to the browser.
- Called once on page load. No Sheet access — pure config return.

#### `getLiveDashboardSummary()`
- Calculates LC, UL, TLH, ALH for Q1 and Q2.
- Reads from `MASTER_METRICS_SHEET_ID` → `MIS Base`.
- Only counts rows where `Attendance Status = "present"`.
- Returns:
  ```json
  {
    "Q1": { "lc": 1200, "ul": 340, "tlh": 4800, "alh": 14.1 },
    "Q2": { "lc":  980, "ul": 290, "tlh": 3900, "alh": 13.4 }
  }
  ```

#### `getMetricDrilldownData()`
- Returns every row from `MIS Base` as a normalised JS object.
- Skips completely empty rows and rows missing both `EMPID` and `Quarter`.
- Each row object has keys: `quarter, month, typeOfTraining, schools, programName, courseName, attendanceStatus, gradeSeries, lob, productLine, empId, name, trainingMode, totalHours`
- Called once (on first KPI or pillar click), then cached in the browser.

#### `getRealChartAnalyticsData()` *(available but currently unused)*
- Pre-computes LOB and Grade training hour aggregations on the server.
- Frontend now does this client-side from the cached ledger.

#### `loadPillarCanvas(pillarName)`
- Legacy compatibility shim. Just returns the pillar name back to the browser.
- The browser's success handler then calls `openPillar()`.

#### `getLastRefreshedTimestamp()`
- Returns the current server time as `"27 Jun 2026, 10:30 AM"`.

#### `convertDriveLink(url)`
- Converts a Google Drive share URL → thumbnail URL for image display.
- Output: `https://drive.google.com/thumbnail?sz=w1000&id=FILE_ID`

---

## 7. Frontend Reference — Index.html

### Boot Sequence

```
DOMContentLoaded fires
  ├── getDashboardMetadata()    → renderPillarCards(metadata)
  └── getLiveDashboardSummary()
        ├── renderTopStats(summary)    ← 4 KPI cards + comparison matrix
        └── setLastRefreshed()         ← header timestamp badge
```

### JavaScript Function Reference

#### `renderPillarCards(metadata)`
Clears `#pillars-grid` and builds one card per pillar from `DASHBOARD_CONFIG`. Reads `color`, `accent`, `streamLabel`, `description`, and `tabs.length`.
> **Vibe coder note:** Never touch this function. Add/edit pillars only in `DASHBOARD_CONFIG` in `code.gs`.

#### `renderTopStats(summary)`
Fills the 4 KPI cards and comparison matrix. Active quarter = Q2 if `Q2.lc > 0`, otherwise Q1. Delta = `((Q2 - Q1) / Q1) × 100`.

#### `openPillar(pillarName)`
Shows `drilldown-view`. Builds sub-program tab buttons from `globalMetadata[pillarName].tabs`. Loads ledger data if not yet cached, then calls `selectPillarTab()`.

#### `selectPillarTab(pillarName, tabName, btnEl)`
Highlights the active tab. Filters `globalRawLedgerRows` — matches `tabName` (case-insensitive substring) against `programName`, `courseName`, `schools`, `typeOfTraining`. Passes results to `renderPillarTabContent()`.

#### `renderPillarTabContent(rows, tabName)`
Calculates 4 metrics (present-only for learner/hours). Renders the metrics grid and a data table (max 100 rows) with colour-coded attendance badges. Shows empty state if no rows match.

#### `openMetricDrilldown(metricType)`
Shows `metric-drilldown-view`. Fetches ledger if not cached, then calls `initializeBIConsoleElements()`.

#### `initializeBIConsoleElements()`
Populates all 8 filter dropdowns. Sets Quarter filter to active quarter by default. Calls `applyGlobalBIWorkspaceFilters()`.

#### `applyGlobalBIWorkspaceFilters()`
Reads all 8 filter values → filters ledger → recalculates 4 KPIs → re-renders 4 charts → updates record count.

#### `resetAllFilters()`
Sets all 8 dropdowns to `"ALL"` and re-applies filters.

#### Chart Functions

| Function | Chart Type | Click-to-Filter Action |
|---|---|---|
| `renderGradeAttendanceChart()` | Stacked ColumnChart | Click bar → sets Grade Series filter |
| `renderLobAttendanceChart()` | Stacked ColumnChart | Click bar → sets LOB filter |
| `renderHoursByPhaseChart()` | ColumnChart | Click bar → sets Quarter filter |
| `renderModeOfLearningChart()` | BarChart | Click bar → resets attendance filter |

All charts use `google.visualization.events.addListener(chart, 'select', ...)` to handle clicks.

#### `downloadFilteredBIEngineCSV()`
Exports `currentlyFilteredSubsetCache` as a `.csv` file. Columns: Type of Training, Schools, Program Name, Course Name, EMPID, NAME, GRADE SERIES, LOB, Product Line, Attendance Status, Total Training Hours. Fully RFC 4180 compliant (handles commas, quotes, newlines in data).

#### `refreshDashboard()`
Clears both caches and re-calls `getLiveDashboardSummary()`. Spins the refresh icon while loading.

#### `exportToPDF()`
Ensures `homepage-view` is visible, calls `window.print()`, then restores the previous view. Print CSS (`@media print`) hides all navigation buttons and UI chrome.

---

## 8. Configuration Guide for Developers

### The Golden Rule
**Edit `code.gs` only for 99% of changes.** You rarely need to touch `Index.html`.

### Change a Pillar's Google Sheet

1. Open the Google Sheet you want to connect.
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/`**`COPY_THIS_PART`**`/edit`
3. In `code.gs`, update the `id` field for that pillar:

```javascript
"Early Career Development": {
  id: "PASTE_NEW_SHEET_ID_HERE",  // ← only this line changes
  ...
}
```

### Change a Pillar's Sub-Program Tabs

```javascript
"Skill Development": {
  tabs: ["New Track 1", "New Track 2", "New Track 3"],
  ...
}
```

Tab names must appear as a **substring** in the `Program Name`, `Course Name`, `Schools`, or `Type of Training` column of `MIS Base`. If the match fails, the tab will show "No data found" — check your spelling against the sheet data.

### Change a Pillar's Brand Colour

```javascript
"Leadership Development": {
  color: "#12341D",   // card top border + badge background
  accent: "#AE7F2E",  // footer label colour
  ...
}
```

### Change the Master Metrics Sheet

```javascript
const MASTER_METRICS_SHEET_ID = "YOUR_NEW_SHEET_ID_HERE";
```

---

## 9. How to Add a New Pillar

One block in `code.gs`. No HTML changes needed.

```javascript
// Add inside DASHBOARD_CONFIG:
"My New Pillar": {
  id: "PASTE_SHEET_ID_HERE",
  tabs: ["Track A", "Track B"],
  color: "#1E3A8A",
  accent: "#3B82F6",
  streamLabel: "Strategic Stream 07",
  description: "One sentence describing what this pillar covers."
}
```

Save → deploy a new version → the card appears automatically on the homepage.

---

## 10. How to Deploy / Publish

1. Go to [script.google.com](https://script.google.com) and open your Apps Script project.
2. Paste in all files: `code.gs`, `Index.html`, and all `Pillar_*.html` files.
3. Click **Deploy → New Deployment**.
4. Select type: **Web App**.
5. Configure:
   - **Execute as:** Me *(the Google account that owns the Sheets)*
   - **Who has access:** Your organisation domain, or `Anyone` for broader access
6. Click **Deploy**.
7. Copy the **Web App URL** — share this link with HRBPs and Leaders.

Web App URL format: `https://script.google.com/macros/s/AKfyc.../exec`

---

## 11. How to Update the Web App After Code Changes

After editing any file:

1. Click **Deploy → Manage Deployments**.
2. Click the **pencil (edit) icon** on your active deployment.
3. Set **Version** to **"New version"**.
4. Click **Deploy**.

> Users must **hard-refresh** their browser (`Ctrl+Shift+R` on Windows / `Cmd+Shift+R` on Mac) to see changes. Simply reloading is not enough after a new version deploy.

---

## 12. User Guide — HRBPs & Leaders

### Dashboard Homepage

| Element | What to Do |
|---|---|
| **4 KPI Cards** (top row) | Shows active quarter totals. Click any card → opens BI Analytics Console |
| **Quarter Review Matrix** | Q1 vs Q2 side-by-side. Green % = improvement. Red % = decline |
| **Pillar Cards** (grid) | Click any card → opens that program's detail view with tracks and participant data |
| **Refresh button** (header) | Pulls the latest data from Google Sheets without reloading the page |
| **Export PDF button** (header) | Opens print dialog — homepage KPIs and pillar cards print cleanly |

### BI Analytics Console

Opened by clicking any KPI card.

| Element | Description |
|---|---|
| **8 Filter Dropdowns** (left) | Filter by Quarter, Month, Training Type, LOB, Course, Attendance, Schools, Grade |
| **Reset All** | Clears all 8 filters instantly |
| **4 KPI Mini-Cards** | Update live as you change filters |
| **4 Charts** | Update live. **Click a bar/column** to apply that value as a filter automatically |
| **Record Count** | Shows how many rows match your current filters |
| **Download CSV** | Exports the current filtered view as a `.csv` file |

### Pillar Detail View

Opened by clicking a pillar card on the homepage.

| Element | Description |
|---|---|
| **Sub-program tabs** | Click to switch between tracks within the pillar |
| **Metrics panel** (right) | Unique Learners, Total Hours, Avg Hours, Total Records for the selected track |
| **Data table** (left) | Up to 100 participant records. Green badge = Present, Red badge = Absent |

---

## 13. Metric Definitions & Calculations

> All calculations count only rows where `Attendance Status = "present"` unless stated otherwise.

### Homepage KPIs (server-side, from `getLiveDashboardSummary`)

| Metric | Full Name | Formula |
|---|---|---|
| **LC** | Learning Count | Count of all present training session rows per quarter |
| **UL** | Unique Learners | Count of distinct EMPID values in present rows |
| **TLH** | Total Learning Hours | `SUM(Total Training Hours)` for present rows, rounded |
| **ALH** | Average Learning Hours | `TLH ÷ UL`, rounded to 1 decimal |
| **% Delta** | Quarter Variance | `((Q2 − Q1) ÷ Q1) × 100` |

### BI Console KPIs (client-side, on filtered subset)

| KPI | Formula |
|---|---|
| Unique Learners | `new Set(filteredRows.map(r => r.empId)).size` |
| Total Training Hours | `filteredRows.reduce((sum, r) => sum + r.totalHours, 0)` |
| Avg Training Hours | `Total Hours ÷ Unique Learners` |
| Courses Delivered | `new Set(filteredRows.map(r => r.courseName)).size` |

---

## 14. Troubleshooting

### KPI cards show 0 or stay on "Loading…"
- Verify `MASTER_METRICS_SHEET_ID` in `code.gs` is the correct sheet ID.
- Confirm a tab named exactly `MIS Base` exists in that sheet.
- Confirm the Apps Script account has **Editor access** to the Google Sheet.
- In Apps Script → **Executions**, check if `getLiveDashboardSummary` logged an error.

### Pillar cards don't appear on the homepage
- Open the browser console (`F12`) and look for JavaScript errors.
- In Apps Script editor, manually run `getDashboardMetadata()` and check the Logs for output.

### Clicking a pillar card shows "No data found"
- Expected for pillars whose sheet IDs are still placeholders.
- Also occurs when the tab name in `DASHBOARD_CONFIG.tabs` doesn't substring-match any value in `Program Name`, `Course Name`, `Schools`, or `Type of Training` in MIS Base. Check your spelling.

### Charts are blank
- Requires an active internet connection (Google Charts loads from CDN).
- If the filtered dataset is empty, charts render blank. Try clicking **Reset All**.
- Do not rename the chart `<div>` IDs in `Index.html` — the JS targets them by exact ID.

### "Tab not found" error in Apps Script logs
- The sheet tab must be named `MIS Base` exactly — case-sensitive, no extra spaces.

### CSV export file is empty
- Record Count must be > 0 before downloading. Apply different filters or click Reset All.

### Users still see old version after a code update
- You must deploy a **New Version** in Manage Deployments (not just save).
- Users must **hard-refresh** (`Ctrl+Shift+R` / `Cmd+Shift+R`) after the new version is deployed.

---

## 15. Known Limitations & Pending Work

| Item | Status | Action Required |
|---|---|---|
| Voice of Associates sheet ID | ⚠️ Placeholder | Replace `"YOUR_TESTIMONIALS_AND_EXPERTS_SHEET_ID_HERE"` in `DASHBOARD_CONFIG` |
| L&D PF Digital Experts sheet ID | ⚠️ Placeholder | Same as above |
| Pillar detail from per-pillar sheets | Not implemented | Pillar detail tabs currently match only against `MIS Base`. Per-pillar sheets (ECD, eMACH, etc.) are not individually queried yet |
| Q3/Q4 support | Partial | Charts show Q3/Q4 bars but homepage KPIs only calculate Q1 and Q2 |
| Mobile BI console layout | Basic | Usable but sidebar + charts not fully optimised for small screens |
| User-level access control | Not implemented | All users with the URL see all data |
| Auto-refresh on data change | Not implemented | Use the manual Refresh button |

---

## Appendix — Colour Reference

| Hex | Used For |
|---|---|
| `#12341D` | Header background, chart primary bars, pillar detail headers |
| `#21552F` | Most pillar top borders and stream badges |
| `#AE7F2E` | Gold accent — export button, matrix header, card footer labels |
| `#E1B58E` | Warm sand — Managerial pillar accent, filter sidebar labels |
| `#478159` | Secondary green — eMACH Academy accent |
| `#4E0973` | Brand purple — PF Academy pillar |
| `#1E3A8A` | Royal blue — Digital Experts pillar |
| `#F8FAFC` | Page background (near-white slate) |
