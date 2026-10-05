/**
 * Google Sheets lead capture for the SIGNOVA website.
 * 1. Create a Sheet → Extensions → Apps Script → paste this file.
 * 2. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone.
 * 3. Put the web-app URL in GOOGLE_SHEETS_WEBHOOK_URL.
 */
function doPost(e) {
  var lead = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
  var cols = ["submittedAt", "name", "company", "email", "phone", "businessType", "location", "signage", "budget", "timeline", "message"];
  if (sheet.getLastRow() === 0) sheet.appendRow(cols.concat(["files", "attribution"]));
  sheet.appendRow(cols.map(function (k) { return lead[k] || ""; }).concat([
    (lead.files || []).map(function (f) { return f.name; }).join(", "),
    JSON.stringify(lead.attribution || {}),
  ]));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
