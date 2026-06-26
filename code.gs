// ============================================================
// ✏️ VIBE CODER ZONE — Edit this config to add/update pillars
// Each pillar needs: id, tabs, color, accent, streamLabel, description
// ============================================================
const DASHBOARD_CONFIG = {
  "Early Career Development": {
    id: "1xygMOiZrXKV7NGMhLoIk3UVtFsvkYmXd1vnokjFQA5Y", // ✏️ Sheet ID
    tabs: ["FTE Bootcamp", "MCA Internship", "FDEs", "ImpactX"], // ✏️ Tab names
    color: "#21552F",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 01",
    description: "Accelerated onboarding tracks, intensive technical bootcamps, and cross-functional engineering exposure."
  },
  "eMACH Academy": {
    id: "1GC3NVsacRGAWVfdnfbV4FJo-22hrWrjlq8c7NydTIDU", // ✏️ Sheet ID
    tabs: ["iTurmeric Certification", "Enabling 4S"], // ✏️ Tab names
    color: "#21552F",
    accent: "#478159",
    streamLabel: "Strategic Stream 02",
    description: "Architecture blueprints, system design fundamentals, and enterprise-grade execution training patterns."
  },
  "PF Academy (Purple Fabric Academy)": {
    id: "12N5iwPYpuePzFE30M2AP6G73nbxJjqHQOn9lvbZm-NQ", // ✏️ Sheet ID
    tabs: ["L1 Digital Module", "L2 Business Impact AI", "Internal Adoption", "External Partner"], // ✏️ Tab names
    color: "#4E0973",
    accent: "#7A53A2",
    streamLabel: "Strategic Stream 03",
    description: "Digital adoption modules, AI-driven business impact programs, and partner enablement tracks."
  },
  "Skill Development": {
    id: "1hHVpxUaoL1VIBLymVCxEQSD9_Z4wkpf_nvbqB_hLwx8", // ✏️ Sheet ID
    tabs: ["TechLead Program", "Monthly Calendar", "Domain Delphi", "Full Stack Developer"], // ✏️ Tab names
    color: "#21552F",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 04",
    description: "Technical upskilling, leadership tracks, and domain-specific capability development programs."
  },
  "Managerial Development": {
    id: "1Pggj0ErPQRVuNUngynD30xQOAzHT2oDCXBOEpOV9HOg", // ✏️ Sheet ID
    tabs: ["Mid-Managerial Program"], // ✏️ Tab names
    color: "#21552F",
    accent: "#E1B58E",
    streamLabel: "Strategic Stream 05",
    description: "Mid-management excellence, people leadership frameworks, and business acumen building programs."
  },
  "Leadership Development": {
    id: "1flFSZtPfhvn9IyOQEwBhRNUtlz4z3D4HHuJEvJZSiI8", // ✏️ Sheet ID
    tabs: ["LDAP-1", "LDAP-2"], // ✏️ Tab names
    color: "#12341D",
    accent: "#AE7F2E",
    streamLabel: "Strategic Stream 06",
    description: "Senior leadership acceleration, executive development, and organizational strategy programs."
  },
  "Voice of Associates (Testimonials)": {
    id: "YOUR_TESTIMONIALS_AND_EXPERTS_SHEET_ID_HERE", // ✏️ Put your sheet ID here
    tabs: ["Testimonials Data"], // ✏️ Tab name
    color: "#AE7F2E",
    accent: "#21552F",
    streamLabel: "Feedback Portal",
    description: "Direct program feedback, training evaluation logs, and active cohort testimonials from live tracks."
  },
  "L&D PF Digital Experts & Web Apps": {
    id: "YOUR_TESTIMONIALS_AND_EXPERTS_SHEET_ID_HERE", // ✏️ Put your sheet ID here
    tabs: ["Driving Results Team"], // ✏️ Tab name
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





