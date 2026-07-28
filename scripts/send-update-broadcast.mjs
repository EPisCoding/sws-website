#!/usr/bin/env node
// Sends the CURRENT update (content/current-update.md + latest photos) to
// EVERY past donor, as an on-demand progress update. Separate from
// scripts/send-thank-you-emails.mjs (which thanks each NEW donor once).
//
// A broadcast intentionally reaches people already emailed, so it does NOT
// use data/donors-emailed.json. One email per unique donor address. Because
// it reaches real supporters it is HARD-GATED:
//   Dry run (default): nothing sent; a report of who WOULD be emailed plus a
//   rendered sample email is written to REPORT_FILE.
//   Real send: requires BOTH CONFIRM_BROADCAST=SEND and ZEPTOMAIL_TOKEN, else
//   it stays a dry run.
// PII rule: only counts to stdout/stderr; names/emails only in REPORT_FILE.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const CHARGES_FILE = process.env.CHARGES_FILE;
const REPORT_FILE = process.env.REPORT_FILE || "broadcast-dry-run.md";
const UPDATE_FILE = "content/current-update.md";
const PHOTO_DIR = "assets/donor-updates";
const SITE_BASE = "https://www.smartwalkingstick.co.uk";
const FROM_ADDRESS = "hello@smartwalkingstick.co.uk";
const FROM_NAME = "SWS Team";
const SUBJECT = "An update from the Smart Walking Stick";
const ZEPTOMAIL_ENDPOINT = "https://api.zeptomail.eu/v1.1/email";

const confirmed = process.env.CONFIRM_BROADCAST === "SEND";
const dryRun = !(confirmed && process.env.ZEPTOMAIL_TOKEN);

if (!CHARGES_FILE || !existsSync(CHARGES_FILE)) {
  console.error("CHARGES_FILE env var must point at the fetched charges JSON.");
  process.exit(1);
}
if (confirmed && !process.env.ZEPTOMAIL_TOKEN) {
  console.error("CONFIRM_BROADCAST=SEND but ZEPTOMAIL_TOKEN is not set; refusing.");
  process.exit(1);
}

const charges = JSON.parse(readFileSync(CHARGES_FILE, "utf8").replace(/^﻿/, ""));
const updateParagraph = existsSync(UPDATE_FILE) ? readFileSync(UPDATE_FILE, "utf8").trim() : "";
if (!updateParagraph) {
  console.error(UPDATE_FILE + " is empty; refusing to send a blank update.");
  process.exit(1);
}

const photoFiles = existsSync(PHOTO_DIR)
  ? readdirSync(PHOTO_DIR).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort().slice(-3)
  : [];

function titleCase(s) {
  return s.replace(/(^|[\s-])(\p{L})/gu, (m, sep, letter) => sep + letter.toUpperCase());
}
function escapeHtml(s) {
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

const recipients = new Map();
let skippedNoEmail = 0, skippedRefunded = 0;
for (const c of [...charges].sort((a,b)=>(a.created||0)-(b.created||0))) {
  if ((c.amount_refunded||0) >= c.amount) { skippedRefunded++; continue; }
  const email = c.billing_details?.email?.trim();
  if (!email) { skippedNoEmail++; continue; }
  const rawName = c.billing_details?.name?.trim();
  recipients.set(email.toLowerCase(), { email, name: rawName ? titleCase(rawName) : "Friend of SWS" });
}

function renderEmail(donorName) {
  const photoBlock = photoFiles.length
    ? '\n      <p style="margin:0 0 12px;">Here&rsquo;s a look at some recent progress:</p>\n      ' +
      photoFiles.map((f)=>'<img src="'+SITE_BASE+'/'+PHOTO_DIR+'/'+encodeURIComponent(f)+'" alt="SWS progress photo" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:8px;margin:0 0 16px;" />').join("\n      ")
    : "";
  return '<!doctype html>\n<html>\n  <body style="margin:0;padding:0;background:#f6f5f2;">\n    <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:Georgia,\'Times New Roman\',serif;font-size:17px;line-height:1.6;color:#26221c;">\n      <p style="margin:0 0 16px;">Hi '+escapeHtml(donorName)+',</p>\n      <p style="margin:0 0 16px;">A quick update on the Smart Walking Stick, and a thank-you again for supporting it.</p>\n      <p style="margin:0 0 16px;">'+escapeHtml(updateParagraph)+'</p>\n      '+photoBlock+'\n      <p style="margin:16px 0 0;">Thanks again for being part of this,<br />Euan<br /><a href="'+SITE_BASE+'" style="color:#26221c;">The Smart Walking Stick</a></p>\n    </div>\n  </body>\n</html>';
}

async function sendEmail(toAddress, toName, htmlBody) {
  return fetch(ZEPTOMAIL_ENDPOINT, {
    method: "POST",
    headers: { Authorization: "Zoho-enczapikey "+process.env.ZEPTOMAIL_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { address: FROM_ADDRESS, name: FROM_NAME },
      to: [{ email_address: { address: toAddress, name: toName } }],
      subject: SUBJECT, htmlbody: htmlBody,
    }),
  });
}

const list = [...recipients.values()];
console.log(charges.length+" charges; "+list.length+" unique donors; "+skippedNoEmail+" skipped (no email), "+skippedRefunded+" skipped (refunded). Mode: "+(dryRun?"DRY RUN":"SENDING")+".");

let sent = 0, failures = 0; const reportRows = []; let sampleEmail = null;
for (const r of list) {
  const html = renderEmail(r.name);
  if (!sampleEmail) sampleEmail = html;
  if (dryRun) { reportRows.push("| "+r.name+" | "+r.email+" |"); continue; }
  try {
    const res = await sendEmail(r.email, r.name, html);
    if (res.ok) sent++; else { failures++; console.error("Send failed (HTTP "+res.status+")."); }
  } catch (err) { failures++; console.error("Send failed: "+(err.name||"error")+"."); }
}

if (dryRun) {
  const report = ["# Broadcast update — dry run","","Generated: "+new Date().toISOString(),"",
    "**"+reportRows.length+" donor(s) would be emailed.** "+skippedNoEmail+" skipped (no email), "+skippedRefunded+" skipped (refunded).","",
    "Subject: "+SUBJECT, "Photos in this update: "+(photoFiles.length?photoFiles.join(", "):"(none)"),"",
    "| Name | Email |","|---|---|",...reportRows,"","## Fully-rendered sample email","","```html",sampleEmail||"(no recipients)","```",""].join("\n");
  writeFileSync(REPORT_FILE, report);
  console.log("DRY RUN: no emails sent. "+reportRows.length+" would be sent; report written to "+REPORT_FILE+".");
} else {
  console.log("Done: "+sent+" sent, "+failures+" failed.");
  if (failures > 0) process.exit(1);
}
