# sws-website — how to update this site

Static site on GitHub Pages, custom domain www.smartwalkingstick.co.uk. Deploys
automatically from `master` — every push is live within ~1 minute. No build step.

## To post a website update (phone-friendly)
1. Add a new object to the TOP of `content/updates.json`:
   `{ "date":"YYYY-MM-DD", "title":"...", "body":"...", "photos":["<filename>"] }`
2. Put any photos in `assets/donor-updates/` first (date-prefixed filenames, e.g.
   `2026-08-03-handle-test.jpeg`), and reference those filenames in `photos`.
3. Commit both. The `/updates/` page renders them client-side.

## Automation
- `.github/workflows/update-donations.yml` is the only workflow in this repo. It
  runs every 20 minutes, fetches successful charges from Stripe, and commits the
  updated total to `data/donations.json`, which feeds the site's donation tracker.

## Do not touch
- The donation-total step in `update-donations.yml`
- Secret: `STRIPE_RESTRICTED_KEY`

## Note
The donor thank-you/broadcast email system was removed (2026-09-05) and is being
rebuilt from scratch.
