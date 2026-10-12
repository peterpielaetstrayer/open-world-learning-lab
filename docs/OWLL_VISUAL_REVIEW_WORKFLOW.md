# OWLL Visual Review Workflow

**Status:** Source-rendered QA workflow. This does not use Vercel's deploy API or host the site.

## Why
Review website changes visually, including mobile, tablet and desktop screenshots, before spending deployment quota or publishing to production. This supplements, not replaces, actual hosted QA and human editorial review.

## Running a review
1. Open **GitHub → open-world-learning-lab → Actions → OWLL Visual Review Gallery**.
2. Select **Run workflow**, choose the Git branch you want to inspect, and choose `all` (nine pages) or `home` (Home + Start Learning).
3. Wait for the job to finish. At the bottom of the Actions run, download the **OWLL-Visual-Review-Gallery** artifact.
4. Unzip it locally. Open `index.html` in a browser for a navigable screenshot gallery. Click thumbnails for full-page screenshots. `report.json` holds machine-readable page statuses and accessibility findings.
5. To collaborate inside ChatGPT, share the Actions run URL. The assistant can read the audit logs, review the screenshot previews embedded for the Home and Start Learning first screens, or inspect any image files you attach from the artifact.

## Scope and tests
- Mobile: 390 × 844; tablet: 768 × 1024; desktop: 1440 × 900.
- Routes: Home, Start Learning, About, Current Work, First Landing, LOCUS, Releases, Learning Environments, Contact.
- Checks: HTTP 200, single H1 and main landmark, horizontal overflow, browser exceptions, automated axe WCAG 2 A/AA through 2.2 AA findings, working mobile navigation.
- Screenshots: full-page JPEGs in `screenshots/`, plus a local HTML gallery. First-screen screenshots of Home and Start Learning are also encoded in job logs so a collaborator can review them remotely without Vercel.
- Runs build the selected Git commit locally using Node 22, Next.js production mode, Playwright Chromium, and axe. Screenshots are saved as GitHub Actions artifacts for 14 days. No site visitor data are collected and no public Vercel endpoint is requested.

## Review and release process
**Draft branch → GitHub Visual Review → Editorial and accessibility fixes → Pass GitHub checks → Merge → Vercel Production when explicitly ready.**

A screenshot is a design reference, not evidence that an educational approach works. Automated axe checks and browser screenshots do not replace keyboard/screen-reader testing, responsive visual judgment, real visitor feedback, licensing checks or production smoke testing.

### Managing Vercel limits
This workflow itself makes **zero Vercel API deployment calls**. However, GitHub pushes and pull requests may still trigger *separate* Vercel Git-integrated preview deployments if your project's Git settings permit them. Avoid unnecessary pushes; where appropriate, configure Vercel to ignore experimental branches or restrict preview deployments separately. This is not done automatically by the visual-review workflow.

### Limits
- A finished local browser screenshot does not mean a new Vercel preview/production deployment exists.
- GitHub Actions minutes and artifact storage are subject to GitHub plan limits.
- Interactivity cannot be assessed from a static screenshot; use local browser testing and route automation, with live QA before public launch.
