# sws-website — how to update this site

Static site on GitHub Pages, custom domain www.smartwalkingstick.co.uk. Deploys
automatically from `master` — every push is live within ~1 minute. No build step.

## Project updates
- The current update is a single file, `content/current-update.md`, overwritten
  each time. There is no updates page and no update photo folder.
- It is NOT published: `content/` is excluded in `_config.yml`, and no page reads
  it. It was the source for the donor email broadcast, which was removed.
  To show an update on the site, edit the relevant page's `index.html` directly.

## Do not publish
The project owns background IP and is taking IP advice. Public pages describe
function at a high level only:
- No component or part names, part numbers or board names.
- No design-tool names (CAD or PCB software).
- No CAD screenshots or photos of internal electronics.
- `_config.yml` controls what GitHub Pages (Jekyll) publishes. Every file in the
  repo is public by default, including `.md` files, unless it is listed under
  `exclude:` there. Add internal files to that list before committing them.

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
