#!/usr/bin/env node
// Sends a one-time thank-you email (via ZeptoMail) for each successful GBP
// Stripe charge not yet recorded in data/donors-emailed.json.
//
// Modes:
//   Dry run (default): no emails are sent and the ledger is untouched; a
//   report of who WOULD be emailed, plus one fully-rendered sample email,
//   is written to REPORT_FILE. Real sending happens only when either
//   SENDING_ENABLED=true (the committed master switch, flipped after Euan
//   approved the first batch) or SEND_EMAILS_INPUT=true (manual
//   workflow_dispatch override for that first approved batch).
//
// PII rule: only charge IDs and counts go to stdout/stderr. Donor names and
// emails appear only inside REPORT_FILE (uploaded as a private artifact),
// never in Action logs.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const CHARGES_FILE = process.env.CHARGES_FILE;
const REPORT_FILE = process.env.REPORT_FILE || "thank-you-dry-run.md";
const LEDGER_FILE = "data/donors-emailed.json";
const UPDATE_FILE = "content/current-update.md";
const PHOTO_DIR = "assets/donor-updates";
const SITE_BASE = "https://www.smartwalkingstick.co.uk";
const FROM_ADDRESS = "hello@smartwalkingstick.co.uk";
const FROM_NAME = "SWS Team";
const SUBJECT = "Thank you for supporting the Smart Walking Stick";
const ZEPTOMAIL_ENDPOINT = "https://api.zeptomail.eu/v1.1/email";

const dryRun = !(
  process.env.SEND_EMAILS_INPUT === "true" ||
  process.env.SENDING_ENABLED === "true"
);

if (!CHARGES_FILE || !existsSync(CHARGES_FILE)) {
  console.error("CHARGES_FILE env var must point at the fetched charges JSON.");
  process.exit(1);
}
if (!dryRun && !process.env.ZEPTOMAIL_TOKEN) {
  console.error("ZEPTOMAIL_TOKEN is not set; refusing to run in send mode.");
  process.exit(1);
}

const charges = JSON.parse(readFileSync(CHARGES_FILE, "utf8").replace(/^﻿/, ""));
const ledger = existsSync(LEDGER_FILE)
  ? JSON.parse(readFileSync(LEDGER_FILE, "utf8"))
  : { chargeIds: [] };
const alreadyEmailed = new Set(ledger.chargeIds);

const updateParagraph = existsSync(UPDATE_FILE)
  ? readFileSync(UPDATE_FILE, "utf8").trim()
  : "";

// Up to the 3 most recent photos, date-prefixed filenames sort newest last.
const photoFiles = existsSync(PHOTO_DIR)
  ? readdirSync(PHOTO_DIR)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .sort()
      .slice(-3)
  : [];

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatPounds(pence) {
  const pounds = pence / 100;
  return pence % 100 === 0 ? `${pounds}` : pounds.toFixed(2);
}

function renderEmail(donorName, amountPence) {
  const photoBlock = photoFiles.length
    ? `
      <p style="margin:0 0 12px;">Here&rsquo;s a look at some recent progress:</p>
      ${photoFiles
        .map(
          (f) =>
            `<img src="${SITE_BASE}/${PHOTO_DIR}/${encodeURIComponent(f)}" alt="SWS progress photo" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:8px;margin:0 0 16px;" />`
        )
        .join("\n      ")}`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f5f2;">
    <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#26221c;">
      <p style="margin:0 0 16px;">Hi ${escapeHtml(donorName)},</p>
      <p style="margin:0 0 16px;">Thank you so much for your donation of &pound;${formatPounds(amountPence)} to the Smart Walking Stick. It genuinely makes a difference, and I&rsquo;m really grateful you&rsquo;re backing this.</p>
      <p style="margin:0 0 16px;">Quick update on where things stand right now:</p>
      <p style="margin:0 0 16px;">${escapeHtml(updateParagraph)}</p>
      ${photoBlock}
      <p style="margin:16px 0 0;">Thanks again for being part of this,<br />Euan<br /><a href="${SITE_BASE}" style="color:#26221c;">The Smart Walking Stick</a></p>
    </div>
  </body>
</html>`;
}

async function sendEmail(toAddress, toName, htmlBody) {
  const res = await fetch(ZEPTOMAIL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Zoho-enczapikey ${process.env.ZEPTOMAIL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { address: FROM_ADDRESS, name: FROM_NAME },
      to: [{ email_address: { address: toAddress, name: toName } }],
      subject: SUBJECT,
      htmlbody: htmlBody,
    }),
  });
  return res;
}

// Newest first so the dry-run report reads naturally.
const pending = charges
  .filter((c) => !alreadyEmailed.has(c.id))
  .sort((a, b) => (b.created || 0) - (a.created || 0));

console.log(
  `${charges.length} successful GBP charges; ${alreadyEmailed.size} already thanked; ${pending.length} pending.`
);

let sent = 0;
let skippedNoEmail = 0;
let skippedRefunded = 0;
let failures = 0;
const reportRows = [];
let sampleEmail = null;

for (const charge of pending) {
  const email = charge.billing_details?.email;
  const name = charge.billing_details?.name?.trim() || "Friend of SWS";
  const amountPence = charge.amount;

  // Don't thank a donation that was fully refunded.
  if ((charge.amount_refunded || 0) >= charge.amount) {
    console.log(`Skipping ${charge.id}: fully refunded.`);
    ledger.chargeIds.push(charge.id);
    skippedRefunded += 1;
    continue;
  }
  if (!email) {
    console.log(`Skipping ${charge.id}: no billing email on charge.`);
    ledger.chargeIds.push(charge.id);
    skippedNoEmail += 1;
    continue;
  }

  const html = renderEmail(name, amountPence);
  if (!sampleEmail) sampleEmail = html;

  if (dryRun) {
    reportRows.push(
      `| ${charge.id} | ${name} | ${email} | £${formatPounds(amountPence)} | ${new Date((charge.created || 0) * 1000).toISOString().slice(0, 10)} |`
    );
    continue;
  }

  try {
    const res = await sendEmail(email, name, html);
    if (res.ok) {
      ledger.chargeIds.push(charge.id);
      // Persist after every success so a crash can never cause a re-send.
      writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2) + "\n");
      sent += 1;
      console.log(`Sent thank-you for ${charge.id}.`);
    } else {
      failures += 1;
      console.error(`Send failed for ${charge.id}: HTTP ${res.status}.`);
    }
  } catch (err) {
    failures += 1;
    console.error(`Send failed for ${charge.id}: ${err.name || "error"}.`);
  }
}

if (dryRun) {
  const report = [
    "# Thank-you email dry run",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `**${reportRows.length} email(s) would be sent.** ${skippedNoEmail} skipped (no email), ${skippedRefunded} skipped (fully refunded).`,
    "",
    "| Charge | Name | Email | Amount | Date |",
    "|---|---|---|---|---|",
    ...reportRows,
    "",
    "## Fully-rendered sample email (first pending charge)",
    "",
    "```html",
    sampleEmail || "(no pending charges — nothing to render)",
    "```",
    "",
  ].join("\n");
  writeFileSync(REPORT_FILE, report);
  console.log(
    `DRY RUN: no emails sent, ledger untouched. ${reportRows.length} would be sent; report written.`
  );
} else {
  if (sent + skippedNoEmail + skippedRefunded > 0) {
    writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2) + "\n");
  }
  console.log(
    `Done: ${sent} sent, ${skippedNoEmail} skipped (no email), ${skippedRefunded} skipped (refunded), ${failures} failed.`
  );
  if (failures > 0) process.exit(1);
}
