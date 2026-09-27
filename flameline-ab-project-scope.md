# Flameline AB — Website Project Scope Summary

**Status:** Two-package proposal sent to client — pending client decision
**Last updated:** 2026-09-27

---

## 1. Client

- **Client:** Flameline AB — B2B cigar import and distribution company, Borås, Sweden

## 2. Original Requested Scope (from client's email)

Five sections/pages:
1. **Landing / Home**
2. **Events** — with a booking/signup form
3. **Cigar Experience**
4. **Brand / Trademark** — Horacio & Barreda
5. **Restricted-access B2B Portal** — partner login, price lists, ordering

Client will supply later: brand/product photos, event photos, one portrait image.

## 3. Design & Content Asset Supplied

Client sent `Flameline_Website_v2_dc.html` — a fully designed and worded prototype (built via Claude Design), covering:

- Dark cigar-lounge visual identity — Cormorant Garamond / Inter Tight / JetBrains Mono, defined color palette, 18+ age gate
- Complete copy for all 4 public sections: hero, event packages (Discovery / Signature / Reserve, with pricing), cigar-cutting/lighting guide, cigar history timeline, cigar anatomy breakdown, tasting tips, brand tabs (Horacio & Barreda)
- Full B2B portal UI: partner login form, distributor price list table with quantity selectors, volume rebate logic (4% off at 10+ boxes, 8% off at 25+ boxes), "place order" flow, partner resale pricing reference

**Critical caveat — this file is a prototype, not deployable code:**
- Written in a proprietary scripting syntax (`{{ }}` bindings, `sc-if`/`sc-for`, custom JS state class) specific to the design tool — needs to be rebuilt in a real production stack
- **Login is fully fake:** any properly formatted email + password of 4+ characters logs a user in. No real accounts exist.
- **Price list is hardcoded** in the JavaScript, not pulled from any real data source
- **"Place Order" is fake:** generates a random order number client-side and displays it. Nothing is saved, emailed, or seen by Flameline.

## 4. Confirmed B2B Portal Requirements

1. **Partner accounts:** 1–5 fixed distributor logins, provisioned directly by Lam. No self-service signup, no partner-management admin panel.
2. **Price list:** one shared price list for all partners. No per-partner pricing logic.
3. **Order handling:** "Place Order" submits and emails Flameline the order details. Flameline handles fulfillment and billing via invoice, outside the site. **No payment gateway, no online payment processing.**
4. **Price updates:** roughly once a year — settled by the package structure below (Package A: on-request by Lam; Package B: self-service admin).

## 5. Shared Scope — Both Packages

- All 5 sections above, fully rebuilt in a production stack (prototype's fake login/price list/order logic is not reused)
- 18+ age gate, full mobile responsiveness
- Real authentication, 1–5 partner accounts
- Shared price list with 4%/8% volume rebate logic
- "Place Order" → email to Flameline
- Client photo/portrait integration, deployment, domain connection
- **Technical SEO** only: meta tags, sitemap.xml, robots.txt (portal excluded from indexing), semantic HTML/alt text, canonical tags. Excludes keyword research, content strategy, backlinks, analytics setup, schema markup, ongoing SEO content — out of scope per client's original brief.

## 6. Package A — Managed

| | Detail |
|---|---|
| **Price** | $2,200 upfront + $85/month (12-month minimum) |
| **Price & content editing** | Lam edits on request. Included in monthly fee, up to 3h/month. |
| **Monthly fee also covers** | Automated uptime monitoring with alerts; monthly backup check/verification (Supabase Pro daily backups); monthly security/dependency updates; short monthly status report (what changed, hours used, issues); 1-business-day response |
| **Partner accounts** | Lam creates/resets on request |
| **Order safety** | Email only (no order-history DB unless added as add-on) |
| **Revision rounds pre-launch** | 2 |
| **Timeline** | 3.5–4 weeks from receipt of assets |
| **Exit** | After 12 months, 30 days' notice either side; code/credentials transferred on exit |

No free introductory month — considered and rejected: it would waive monitoring/backup/security work during the highest-risk post-launch window and discount ~8% off the 12-month commitment for no return.

## 7. Package B — Full Handover

| | Detail |
|---|---|
| **Price** | $3,800 one-time |
| **Price & content editing** | Client self-edits via password-gated admin: prices, rebate thresholds, all site text, event packages, images. No developer needed. |
| **Order safety** | Every order stored in database + order history view, in addition to email |
| **Partner accounts** | Self-service password reset |
| **Handover materials** | Written guide, recorded walkthrough, 60-minute live training |
| **Ownership at launch** | Repo, hosting, database, email accounts all transferred to client |
| **Revision rounds pre-launch** | 3 |
| **Warranty** | 90 days bug fixes, then no ongoing obligation |
| **Timeline** | 6–7 weeks from receipt of assets |

Timeline note: AI-assisted coding tools cut build hours by roughly 20-25%, concentrated in prototype-rebuild and CRUD scaffolding. This does not compress RLS/auth testing on the admin panel (highest-risk item — must not be rushed) or client revision-round turnaround. 5-6 weeks was considered and rejected as too aggressive; 6-7 weeks holds a buffer against those fixed costs.

## 8. Break-even

Package B costs $1,600 more upfront than A. At $85/month, that gap closes at ~19 months. Under 19 months of use, A is cheaper; beyond that, B is cheaper and gives full independence.

## 9. Infrastructure Recommendation

Supabase Pro plan (~$25/month, billed to client) recommended over Free tier: Free has no automated backups and auto-pauses projects after 7 days of inactivity — a real risk for a low-traffic B2B portal going offline unexpectedly. Pro adds daily backups (7-day retention), no pausing, custom domain support.

**Domain registration:** always stays in the client's own name/account, in both packages, no exception — holding a client's domain creates a hostage-asset risk if the working relationship ends.

**Hosting/database/email held by Lam instead of client:** discussed as a possible Package A upsell (~+$20-25/month) but not yet built into the current proposal. Would require pricing in payment-failure and usage-overage risk, and ideally a proper business entity rather than a personal account before offering it.

## 10. Client-Side Dependencies

- Timeline starts on receipt of photos + portrait
- SPF/DKIM DNS records must be added to Flameline's domain for reliable order/booking email delivery — Lam provides exact values, client's domain admin adds them
- Cookie/privacy wording and Swedish tobacco-marketing compliance are client's responsibility; Lam implements the age gate and pages only

## 11. Explicitly Out of Scope (either package)

- Online payment processing / e-commerce (cart, checkout, card handling)
- Partner-management admin panel
- Per-partner custom pricing
- Paid ad management
- Social media management
- Ongoing SEO content work beyond initial technical setup

## 12. Payment Terms

- **Package A:** $2,200 split 40% signing / 30% staging approval / 30% launch; $85/month billed in advance starting launch month
- **Package B:** $3,800 split 40% signing / 30% staging approval / 30% launch

## 13. Add-ons (either package)

| Add-on | Price |
|---|---|
| Swedish translation of public copy (client supplies translation) | $450 |
| Order history database (Package A only, if added) | $250 |
| Extra pre-launch revision round | $150 |
| Partner accounts beyond 5 | $50 each |
| Out-of-scope hourly work | $30/h |

## 14. Pricing Basis

- Solo developer, near-amateur experience — deliberately priced below premium/agency rates
- One-time discount for this project only (referral, first project of this scope, pre-supplied design) — not a standing rate
- Effective hourly rate ≈ $22-25/h on the build; the $85/month retainer is priced at the same $30/h rate applied to the 3h cap, not marked up further
