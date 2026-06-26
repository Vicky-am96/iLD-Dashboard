// ============================================================
// ✏️ VIBE CODER ZONE — Edit this config to add/update pillars
//
// CARD ORDER: The order of pillars here = the order cards appear on screen.
//             Move a block up/down to reorder the dashboard cards.
//
// PER-TAB LAYOUTS — set tabLayouts to control how each tab renders:
//   "auto"        → smart detect (Drive links → gallery, else → table)
//   "gallery"     → image cards with lightbox zoom
//   "table"       → scrollable data table with status badge colouring
//   "kpi"         → metrics panel only (no table or gallery)
//   "testimonial" → styled quote cards (best for feedback data)
//
// PILLAR BANNER — set pillarBanner to a raw HTML string to show a
//   custom info banner at the top of that pillar's drilldown view.
//   Example: pillarBanner: `<div class="bg-green-50 p-4 rounded-xl text-sm">Note here</div>`,
// ============================================================
const DASHBOARD_CONFIG = {
  "Early Career Development": {
    id: "1xygMOiZrXKV7NGMhLoIk3UVtFsvkYmXd1vnokjFQA5Y", // ✏️ Sheet ID
    tabs: ["FTE Bootcamp", "MCA Internship", "FDEs", "ImpactX"], // ✏️ Must match sheet tab names exactly
    tabLayouts: {                   // ✏️ Set layout per tab — remove a line to use "auto"
      "FTE Bootcamp":   "gallery",  //    Photos/cohort images → gallery
      "MCA Internship": "table",
      "FDEs":           "table",
      "ImpactX":        "auto"
    },
    // pillarBanner: `<div class="bg-[#21552F]/10 border border-[#21552F]/20 p-4 rounded-xl text-sm text-[#21552F] font-medium">ECD note: cohort photos load in FTE Bootcamp tab.</div>`,
    color: "#21552F",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 01",
    description: "Accelerated onboarding tracks, intensive technical bootcamps, and cross-functional engineering exposure."
  },
  "eMACH Academy": {
    id: "1GC3NVsacRGAWVfdnfbV4FJo-22hrWrjlq8c7NydTIDU", // ✏️ Sheet ID
    tabs: ["iTurmeric Certification", "Enabling 4S"],
    tabLayouts: {
      "iTurmeric Certification": "auto",
      "Enabling 4S":             "auto"
    },
    color: "#21552F",
    accent: "#478159",
    streamLabel: "Strategic Stream 02",
    description: "Architecture blueprints, system design fundamentals, and enterprise-grade execution training patterns."
  },
  "PF Academy (Purple Fabric Academy)": {
    id: "12N5iwPYpuePzFE30M2AP6G73nbxJjqHQOn9lvbZm-NQ", // ✏️ Sheet ID
    tabs: ["L1 Digital Module", "L2 Business Impact AI", "Internal Adoption", "External Partner"],
    tabLayouts: {
      "L1 Digital Module":      "table",
      "L2 Business Impact AI":  "auto",
      "Internal Adoption":      "auto",
      "External Partner":       "auto"
    },
    color: "#4E0973",
    accent: "#7A53A2",
    streamLabel: "Strategic Stream 03",
    description: "Digital adoption modules, AI-driven business impact programs, and partner enablement tracks."
  },
  "Skill Development": {
    id: "1hHVpxUaoL1VIBLymVCxEQSD9_Z4wkpf_nvbqB_hLwx8", // ✏️ Sheet ID
    tabs: ["TechLead Program", "Monthly Calendar", "Domain Delphi", "Full Stack Developer"],
    tabLayouts: {
      "TechLead Program":      "auto",
      "Monthly Calendar":      "table",
      "Domain Delphi":         "auto",
      "Full Stack Developer":  "table"
    },
    color: "#21552F",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 04",
    description: "Technical upskilling, leadership tracks, and domain-specific capability development programs."
  },
  "Managerial Development": {
    id: "1Pggj0ErPQRVuNUngynD30xQOAzHT2oDCXBOEpOV9HOg", // ✏️ Sheet ID
    tabs: ["Mid-Managerial Program"],
    tabLayouts: {
      "Mid-Managerial Program": "table"
    },
    color: "#21552F",
    accent: "#E1B58E",
    streamLabel: "Strategic Stream 05",
    description: "Mid-management excellence, people leadership frameworks, and business acumen building programs."
  },
  "Leadership Development": {
    id: "1flFSZtPfhvn9IyOQEwBhRNUtlz4z3D4HHuJEvJZSiI8", // ✏️ Sheet ID
    tabs: ["LDAP-1", "LDAP-2"],
    tabLayouts: {
      "LDAP-1": "table",
      "LDAP-2": "table"
    },
    color: "#12341D",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 06",
    description: "Senior leadership acceleration, executive development, and organizational strategy programs."
  },
  "Voice of Associates (Testimonials)": {
    id: "YOUR_TESTIMONIALS_AND_EXPERTS_SHEET_ID_HERE", // ✏️ Put your sheet ID here
    tabs: ["Testimonials Data"],
    tabLayouts: {
      "Testimonials Data": "testimonial"  // ✏️ Renders as styled quote cards
    },
    color: "#AE7F2E",
    accent: "#21552F",
    streamLabel: "Feedback Portal",
    description: "Direct program feedback, training evaluation logs, and active cohort testimonials from live tracks."
  },
  "L&D PF Digital Experts & Web Apps": {
    id: "YOUR_TESTIMONIALS_AND_EXPERTS_SHEET_ID_HERE", // ✏️ Put your sheet ID here
    tabs: ["Driving Results Team"],
    tabLayouts: {
      "Driving Results Team": "auto"
    },
    color: "#1E3A8A",
    accent: "#3B82F6",
    streamLabel: "Digital Experts",
    description: "Internal digital expertise development, web application capability building, and results-driven teams."
  }
};
/**
 * Standard Web App Initialization Handler
 */
function doGet() {
  Logger.log('Entered the doGET Engine Execution Layer');
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Quarterly Learning Dashboard - Q1')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}




/**
 * Server side utility method to embed split component sub-modules at runtime
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}




function getDashboardMetadata() {
  Logger.log('getDashboardMetadata triggered');
  return DASHBOARD_CONFIG;
}




function getRealChartAnalyticsData() {
  try {
    const masterId = DASHBOARD_CONFIG["Early Career Development"].id;
    const ss = SpreadsheetApp.openById(masterId);
    const sheet = ss.getSheetByName("MIS Base");




    if (!sheet) {
      return { lobLabels: [], lobQ1: [], lobQ2: [], gradeLabels: [], gradeQ1: [], gradeQ2: [] };
    }




    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { lobLabels: [], lobQ1: [], lobQ2: [], gradeLabels: [], gradeQ1: [], gradeQ2: [] };




    const lobQ1Map = {}, lobQ2Map = {};
    const gradeQ1Map = {}, gradeQ2Map = {};
    const allowedLOBs = ["iGCB", "iS", "iAI", "iGT", "iGTB", "CORP", "CTO", "iODB", "iTC"];




    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 20) continue;




      const grade = String(row[11] || '').trim();
      const lob = String(row[12] || '').trim();
      const hours = parseFloat(row[19]) || 0;
      const quarterText = String(row[3] || 'Q1').toUpperCase();
      const isQ1 = quarterText.indexOf("Q1") !== -1;




      if (lob && allowedLOBs.some(allowed => lob.includes(allowed))) {
        let matchedLob = allowedLOBs.find(allowed => lob.includes(allowed)) || lob;
        if (isQ1) { lobQ1Map[matchedLob] = (lobQ1Map[matchedLob] || 0) + hours; }
        else { lobQ2Map[matchedLob] = (lobQ2Map[matchedLob] || 0) + hours; }
      }




      if (grade && grade.length > 0 && grade.length < 12) {
        if (isQ1) { gradeQ1Map[grade] = (gradeQ1Map[grade] || 0) + hours; }
        else { gradeQ2Map[grade] = (gradeQ2Map[grade] || 0) + hours; }
      }
    }




    const lobLabels = Object.keys({...lobQ1Map, ...lobQ2Map});
    const gradeLabels = Object.keys({...gradeQ1Map, ...gradeQ2Map}).sort();




    return {
      lobLabels: lobLabels.length ? lobLabels : allowedLOBs,
      lobQ1: lobLabels.map(l => Math.round(lobQ1Map[l] || 0)),
      lobQ2: lobLabels.map(l => Math.round(lobQ2Map[l] || 0)),
      gradeLabels: gradeLabels.length ? gradeLabels : ["G1-G3", "G4-G6", "G7-G9", "G10+"],
      gradeQ1: gradeLabels.map(g => Math.round(gradeQ1Map[g] || 0)),
      gradeQ2: gradeLabels.map(g => Math.round(gradeQ2Map[g] || 0))
    };
  } catch (error) {
    return { lobLabels: [], lobQ1: [], lobQ2: [], gradeLabels: [], gradeQ1: [], gradeQ2: [] };
  }
}




// Global Configuration for master metrics sheet
const MASTER_METRICS_SHEET_ID = "1oE5VoNuJ8o21pqLSeTKVyyUUF4uilDWMxpWPOU6S-ig"; // 💡 Verified from your Early Career Development ID




/**
 * Safely calculates summary values, preventing server-side crashes if data or headers are missing.
 */
function getLiveDashboardSummary() {
  try {
    const ss = SpreadsheetApp.openById(MASTER_METRICS_SHEET_ID);
    const sheet = ss.getSheetByName("MIS Base");
    if (!sheet) return { error: "Tab 'MIS Base' not found" };




    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { error: "Sheet is empty" };




    const headers = data[0].map(h => String(h || '').trim().toLowerCase());
   
    // Defensive Index Matching (checks multiple variations to ensure it never hits -1)
    const attIdx = headers.indexOf("attendance status") !== -1 ? headers.indexOf("attendance status") : 24;
    const qtrIdx = headers.indexOf("quarter") !== -1 ? headers.indexOf("quarter") : (headers.indexOf("quarter detail") !== -1 ? headers.indexOf("quarter detail") : 6);
    const empIdx = headers.indexOf("empid") !== -1 ? headers.indexOf("empid") : (headers.indexOf("employee id") !== -1 ? headers.indexOf("employee id") : 10);
    const hrsIdx = headers.indexOf("total training hours") !== -1 ? headers.indexOf("total training hours") : (headers.indexOf("training hours") !== -1 ? headers.indexOf("training hours") : 31);




    const qData = {
      "Q1": { lc: 0, uniqueEmps: {}, tlh: 0 },
      "Q2": { lc: 0, uniqueEmps: {}, tlh: 0 }
    };




    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < Math.max(attIdx, qtrIdx, empIdx, hrsIdx)) continue;




      const status = String(row[attIdx] || '').trim().toLowerCase();
      let quarter = String(row[qtrIdx] || '').trim().toUpperCase();




      // Normalize common quarter text variations (e.g. "Q1 Detail" -> "Q1")
      if (quarter.indexOf("Q1") !== -1) quarter = "Q1";
      else if (quarter.indexOf("Q2") !== -1) quarter = "Q2";




      if (status === "present" && (quarter === "Q1" || quarter === "Q2")) {
        const empId = String(row[empIdx] || '').trim();
        const hours = parseFloat(row[hrsIdx]) || 0;




        qData[quarter].lc++;
        qData[quarter].tlh += hours;
        if (empId) {
          qData[quarter].uniqueEmps[empId] = true;
        }
      }
    }




    const summary = {};
    ["Q1", "Q2"].forEach(q => {
      const uniqueCount = Object.keys(qData[q].uniqueEmps).length;
      summary[q] = {
        lc: qData[q].lc,
        ul: uniqueCount,
        tlh: Math.round(qData[q].tlh),
        alh: uniqueCount > 0 ? parseFloat((qData[q].tlh / uniqueCount).toFixed(1)) : 0
      };
    });




    return summary;
  } catch (err) {
    return { error: err.toString() };
  }
}


/**
 * Normalized Global BI Workstation Data Streamer
 * Maps complex spreadsheet column strings into clean unified database keys
 */
function getMetricDrilldownData() {
  try {
    const ss = SpreadsheetApp.openById(MASTER_METRICS_SHEET_ID);
    const sheet = ss.getSheetByName("MIS Base");
    if (!sheet) return [];
   
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h || '').trim());
   
    // Flexible substring finder for long or varying headers
    const findIdx = (headerName) => headers.findIndex(h => h.toLowerCase().includes(headerName.toLowerCase()));
   
    // Strict exact finder to prevent "Program Name" or "Course Name" from overriding "NAME"
    const findExactIdx = (headerName) => headers.findIndex(h => h.toLowerCase() === headerName.toLowerCase());


    // Fallback logic: if exact "NAME" header isn't found, default to Column L (Index 11)
    let nameColumnIndex = findExactIdx("NAME");
    if (nameColumnIndex === -1) {
      nameColumnIndex = 11; // Column L fallback
    }


    const indices = {
      typeOfTraining: findIdx("Type of Training"),
      schools: findIdx("Schools"),
      programName: findIdx("Program Name"),
      courseName: findIdx("Course Name"),
      quarter: findIdx("Quarter"),
      month: findIdx("Month"),
      empId: findIdx("EMPID"),
      name: nameColumnIndex, // Safely locked to exact match or Column L
      gradeSeries: findIdx("GRADE SERIES"),
      lob: findIdx("LOB"),
      productLine: findIdx("Product Line"),
      trainingMode: findIdx("Training Mode"),
      attendanceStatus: findIdx("Attendance Status"),
      totalHours: findIdx("Total Training Hours") !== -1 ? findIdx("Total Training Hours") : findIdx("Training Hours")
    };


    const rows = [];
   
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
     
      // SAFE REJECTION: Skip completely empty spreadsheet rows
      if (!row.join('').trim()) {
        continue;
      }
     
      // Safe extraction helper to avoid out-of-bound array readings
      const val = (idx) => (idx !== -1 && row[idx] !== undefined) ? String(row[idx]).trim() : '';


      const empIdVal = val(indices.empId);
      const quarterVal = val(indices.quarter);
     
      // Skip row if both key identifiers are completely missing
      if (!empIdVal && !quarterVal) {
        continue;
      }


      rows.push({
        quarter: quarterVal || "Unknown",
        month: val(indices.month) || "Unknown",
        typeOfTraining: val(indices.typeOfTraining) || "Unknown",
        schools: val(indices.schools) || "Unknown",
        programName: val(indices.programName) || "Unknown",
        courseName: val(indices.courseName) || "Unknown",
        attendanceStatus: val(indices.attendanceStatus) || "Absent",
        gradeSeries: val(indices.gradeSeries) || "Unknown",
        lob: val(indices.lob) || "Unknown",
        productLine: val(indices.productLine) || "Unknown",
        empId: empIdVal,
        name: val(indices.name) || "N/A",
        trainingMode: val(indices.trainingMode) || "In-Person",
        totalHours: parseFloat(row[indices.totalHours]) || 0
      });
    }
   
    return rows;
   
  } catch (err) {
    Logger.log("Error in getMetricDrilldownData: " + err.toString());
    return { error: err.toString() };
  }
}


// Required by Pillar_ECD.html's legacy server-side call pattern — just echoes the name back
function loadPillarCanvas(pillarName) {
  Logger.log('loadPillarCanvas: ' + pillarName);
  return pillarName;
}


/**
 * Reads a specific tab from a pillar's own Google Sheet.
 * Returns headers + all data rows. Drive URLs are auto-converted to thumbnail URLs.
 * Column names vary per pillar — the frontend renders intelligently based on what it receives.
 */
function getPillarTabData(pillarName, tabName) {
  try {
    const cfg = DASHBOARD_CONFIG[pillarName];
    if (!cfg) return { error: 'Pillar "' + pillarName + '" not found in config.' };

    const sheetId = cfg.id;
    if (!sheetId || sheetId.includes('YOUR_')) {
      return { error: 'Sheet ID for "' + pillarName + '" is not configured yet. Update DASHBOARD_CONFIG in code.gs.' };
    }

    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      return { error: 'Tab "' + tabName + '" not found in the "' + pillarName + '" sheet.' };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length === 0) return { headers: [], rows: [] };

    const headers = data[0].map(h => String(h === null || h === undefined ? '' : h).trim());

    const rows = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Skip completely empty rows
      if (!row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')) continue;

      const rowObj = {};
      headers.forEach((h, idx) => {
        let val = row[idx];
        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object' && val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd MMM yyyy');
        } else {
          val = String(val).trim();
          // Auto-convert Google Drive share links to thumbnail URLs for image display
          if (val.includes('drive.google.com')) {
            val = convertDriveLink(val);
          }
        }
        rowObj[h] = val;
      });
      rows.push(rowObj);
    }

    return { pillarName, tabName, headers, rows };

  } catch (err) {
    Logger.log('getPillarTabData error: ' + err.toString());
    return { error: err.toString() };
  }
}


function getLastRefreshedTimestamp() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd MMM yyyy, hh:mm a");
}


function convertDriveLink(url) {
  if (!url || url.indexOf("drive.google.com") === -1) return url;
  try {
    let fileId = "";
    var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) fileId = match[1];
    var idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) fileId = idMatch[1];
    if (fileId) return "https://drive.google.com/thumbnail?sz=w1000&id=" + fileId;
  } catch(e) {}
  return url;
}





