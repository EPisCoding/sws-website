# sws-website — how to update this site

Static site on GitHub Pages, custom domain www.smartwalkingstick.co.uk. Deploys
automatically from `master` — every push is live within ~1 minute. No build step.
Never commit or push without the owner reviewing the diff first.

## Project updates
- The current update is a single file, `content/current-update.md`, overwritten
  each time. There is no updates page and no update photo folder.
- It is NOT published to the website: `content/` is excluded in `_config.yml`.
  It is the source copy for the home page's Progress section, which is edited
  directly in `index.html`.
- The Progress section shows an "Updated <Month Year>" line. Update it, and the
  home page's `lastmod` in `sitemap.xml`, whenever the section changes. Remove
  dated events once they have passed.

## Wording rules
- Never claim the device helps, improves, reduces or prevents anything. The
  device is only "designed to" (e.g. "designed to support walking").
- Research on external cueing may be described as established, with citation.
- Never say or imply it is available to buy or "coming soon".

## Do not publish
The project owns background IP and is taking IP advice. Public pages describe
function at a high level only:
- No component or part names, part numbers or board names.
- No design-tool names (CAD or PCB software).
- No CAD screenshots or photos of internal electronics.
- `_config.yml` `exclude:` only stops a file appearing on the website. If the
  GitHub repository is public, every committed file is still readable on
  github.com. Internal or confidential files do not belong in this repo at all.

## Photos
- Originals live outside the repo in `C:\SWS-Web-Emailing\photos-raw\`. Never
  copy originals into the repo.
- Web versions go in `images/`: apply EXIF orientation, then strip ALL metadata
  (GPS, camera, dates) and confirm it is gone before committing. Follow the
  existing image pattern (sizes, srcset, naming). Always set width/height and
  meaningful alt text.
- People shown must have agreed to appear on the site.

## Personal data
- This site stores no personal data and must stay that way.
- Register interest is an external link to a hosted sign-up form. No embeds,
  iframes, tracking pixels or third-party scripts on our pages.
- Never commit sign-up lists, emails, donor details or exports of any kind.
- `data/donations.json` must only ever contain aggregate totals.

## Automation
- `.github/workflows/update-donations.yml` is the only workflow in this repo. It
  runs every 20 minutes, fetches successful charges from Stripe, and commits the
  updated total to `data/donations.json`, which feeds the site's donation tracker.
- No workflow may upload artifacts or write log output that contains personal
  data (names, email addresses, addresses, amounts per person, Stripe customer
  or charge IDs). This repo is public: its Actions logs and artifacts can be
  read by anyone on GitHub. Log counts and totals only.

## Do not touch
- The donation-total step in `update-donations.yml`
- Secret: `STRIPE_RESTRICTED_KEY`

## Note
The donor thank-you/broadcast email system was removed (2026-09-05) and is being
rebuilt from scratch.
