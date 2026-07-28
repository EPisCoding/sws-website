# sws-website — how to update this site

Static site on GitHub Pages, custom domain www.smartwalkingstick.co.uk. Deploys
automatically from `master` — every push is live within ~1 minute. No build step.

## To post a website update (phone-friendly)
1. Add a new object to the TOP of `content/updates.json`:
   `{ "date":"YYYY-MM-DD", "title":"...", "body":"...", "photos":["<filename>"] }`
2. Put any photos in `assets/donor-updates/` first (date-prefixed filenames, e.g.
   `2026-08-03-handle-test.jpeg`), and reference those filenames in `photos`.
3. Commit both. The `/updates/` page renders them client-side.

## To refresh the update that donors receive
- Edit `content/current-update.md` (one short paragraph). New donors' automatic
  thank-you emails, and any broadcast, use whatever is in this file at send time.
- Drop the latest photos in `assets/donor-updates/`; the newest 3 (by filename) are
  used in emails.

## To email ALL past donors an update (on demand)
1. Make sure `content/current-update.md` and the photos are current (steps above).
2. GitHub → Actions → "Send update email to all donors" → Run workflow.
   - Leave `confirm` blank → DRY RUN: download the report artifact, check who it would
     email and the sample email.
   - Type `SEND` (capitals) → actually emails every donor, once each.
   This is separate from the automatic per-new-donor thank-you (that one is
   `.github/workflows/update-donations.yml`, runs every 20 min, do not disturb it).

## Do not touch
- `data/donors-emailed.json` (thank-you dedupe ledger — the broadcast never uses it)
- The donation-total step in `update-donations.yml`
- Secrets: `STRIPE_RESTRICTED_KEY`, `ZEPTOMAIL_TOKEN`
