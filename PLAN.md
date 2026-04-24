# Phantom — SEO, Architecture, Performance & Style Lab Refactor

## Current status

Implemented locally. The landing page is now `index.html`, shared CSS lives in `assets/css/phantom.css`, the product page uses the shared style system, and the site includes `404.html`, `robots.txt`, `sitemap.xml`, favicon/touch/OG placeholder assets, and a reusable `assets/js/phantom-explorer.js` controller.

Deviation from the original plan: `Phantom.html` is retained as a small compatibility redirect to `index.html` instead of being removed outright. The implementation also adds an explorable Style Lab with eight color themes and seven background modes so visual directions can be compared in-browser before choosing a final default.

## Context

The Phantom site (`cbaileydev/phantom`, deployed on GitHub Pages at `https://cbaileydev.github.io/phantom/`) is currently a three-file monolith: a 455-byte redirect `index.html`, a 1,435-line `Phantom.html` landing page, and a 731-line `products.html` catalog. Both content pages ship 700+ lines of inline CSS with duplicated theme/nav/footer/tweaks definitions, no meta description, no Open Graph/Twitter cards, no favicon, no `robots.txt`/`sitemap.xml`, and no 404 page. The Manus report plus the explicit task list call for:

1. Extracting all CSS to a single external file so browsers can cache it and updates happen in one place.
2. Fixing the redirect anti-pattern by promoting the landing page to `index.html`.
3. Adding the standard SEO/social/favicon/robots/sitemap bundle so the site is discoverable and shareable.
4. Adding a custom 404 page that matches the cyberpunk aesthetic.
5. Reducing CLS with explicit `width`/`height` on inline SVGs and a font preload hint.

Outcome: a maintainable, cached, crawlable, socially-shareable static site with no behavioral regressions to the existing Void/Phosphor/Ember/Mono theme system or the products-page modal/filter logic.

---

## Decisions (confirmed with user)

| # | Decision | Choice |
|---|---|---|
| 1 | index.html strategy | **Rename `Phantom.html` → `index.html`**; delete the redirect. |
| 2 | Default theme per page | **Preserve per-page defaults**: landing page defaults to Void, products page defaults to Ember. Implemented via `data-theme="ember"` on products.html's `<html>` element (no body-class forks needed — the merged CSS already defines every theme). |
| 3 | Asset paths | **Relative** (`favicon.ico`, `assets/og-image.png`, etc.). Works on GH Pages subpath and any future custom domain. |
| 4 | Placeholder binaries | **Generate minimal valid placeholders** via a one-off Python/Pillow script: 32×32 ICO, 180×180 PNG, 1200×630 OG PNG — each a dark background with a white "P". User replaces later. |

---

## Final file structure

```
/home/user/phantom/
├── .git/
├── README.md
├── index.html                    ← renamed from Phantom.html, new <head>, CSS removed
├── products.html                 ← new <head>, CSS removed, <html data-theme="ember">
├── 404.html                      ← new — cyberpunk "Signal Lost" page
├── robots.txt                    ← new
├── sitemap.xml                   ← new
├── favicon.ico                   ← new — 32×32 placeholder
└── assets/
    ├── css/
    │   └── phantom.css           ← new — merged + deduplicated CSS from both pages
    ├── apple-touch-icon.png      ← new — 180×180 placeholder
    └── og-image.png              ← new — 1200×630 placeholder
```

Deleted: the existing redirect `Phantom.html` → `index.html` move supersedes the old `index.html`; there is no `Phantom.html` after the refactor.

---

## Implementation steps

### Step 1 — Create `assets/css/phantom.css` (merged stylesheet)

Create the directory `assets/css/`, then write `phantom.css` by combining:

- **Base (from `Phantom.html` lines 10–728)**: `:root` Void vars, `[data-theme="phosphor"]`, `[data-theme="ember"]`, `[data-theme="mono"]`, global resets, `.container`, `body::before/::after`, `.grid-bg`, `nav` + `.nav-inner` + `.brand` + `.logo-mark` + `.nav-cta` + `.menu-btn`, `.scroll-progress`, `.eyebrow` + `@keyframes pulse`, `.tweaks*` panel, `.foot` + `.links`, `@keyframes scan`, `@media (prefers-reduced-motion: reduce)` (both instances), `@media (max-width: 1024px)`, `@media (max-width: 720px)`, plus landing-page-specific rules (hero, arsenal, pipeline, matrix, final).
- **Products-only (from `products.html` lines 10–259)**: `.page-head`, `.filters` + `.chip`, `.grid` + `.card*`, `.modal*`, `.options` + `.opt*` + `.radio`, `.svc-select` + `.svc-dropdown`, `.qty*`, `.total*`, `.checkout-cta`. Skip anything that already exists in the Phantom-derived base (nav, body, theme vars, footer, tweaks, scroll-progress, eyebrow — all duplicated).
- **Theme-default normalization**: in the merged file, `:root` keeps the Void vars as before, and `[data-theme="ember"]` keeps its full override set. Products.html will opt into Ember via `<html data-theme="ember">` (see step 3).

Preserve every CSS custom property and `@media` rule exactly as currently written. Do not minify. Order: theme vars → base/reset → layout primitives → nav → tweaks → landing-page sections → products-page sections → animations/media-queries at the bottom.

### Step 2 — Rename `Phantom.html` → `index.html`

Use `git mv Phantom.html index.html` (replaces the 455-byte redirect file, since `git mv` over an existing file overwrites after removing the target). Verify `index.html` now contains the full landing-page markup. All internal links currently pointing to `Phantom.html` need to be rewritten — audit both files:

- `products.html` nav → `index.html` (or `./` / `index.html#anchor`)
- `index.html` self-links (if any) — none expected but grep to confirm
- Any `href="Phantom.html..."` anywhere in repo

### Step 3 — Update `<head>` of `index.html` (the new landing page)

Replace the current `<head>` (was lines 3–9, now post-rename) with:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Phantom — The payload that was never there.</title>
<meta name="description" content="Phantom — The payload that was never there. Cyberpunk tools for the modern operator.">

<!-- Open Graph / Twitter -->
<meta property="og:title" content="Phantom">
<meta property="og:description" content="The payload that was never there.">
<meta property="og:image" content="https://cbaileydev.github.io/phantom/assets/og-image.png">
<meta property="og:url" content="https://cbaileydev.github.io/phantom/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Phantom">
<meta name="twitter:description" content="The payload that was never there.">
<meta name="twitter:image" content="https://cbaileydev.github.io/phantom/assets/og-image.png">

<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">

<!-- Fonts (preconnect + preload style + stylesheet) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="assets/css/phantom.css">
```

Delete the entire `<style>…</style>` block (was lines 10–728). Leave the `<script>` block and body markup untouched.

### Step 4 — Update `<head>` of `products.html`

Same pattern as step 3, with two differences:

- **`<html>` tag**: change `<html lang="en">` to `<html lang="en" data-theme="ember">` so the Ember default is preserved without a separate CSS fork.
- **Unique meta description**: `"Phantom product catalog — Veil, Spoof, Stress, and more. Hardware and software for digital ghosts."`
- **og:url / twitter image**: use `https://cbaileydev.github.io/phantom/products.html` for `og:url`; keep shared og-image.

Delete the `<style>…</style>` block (was lines 10–259). Leave the modal template and `<script>` block intact.

Re-verify that the theme-toggle JS (lines 405–731) still honors `data-theme` attribute set on `<html>` at page load — the existing `setTheme()` pattern writes to `document.documentElement.dataset.theme`, so our HTML-level default will work and be overridden by `localStorage` when present. No JS changes needed.

### Step 5 — Add explicit `width`/`height` to inline SVGs

Audit both HTML files for `<svg …>` tags without `width` + `height`. Strategy:

- The `<symbol>` library block in `index.html` (near line 770) defines reusable `viewBox="0 0 64 64"` phantom glyphs — these are referenced via `<use>` in sized containers and don't need width/height themselves.
- Icon-use SVGs in body content (arrows, chevrons, ghost, glyphs via `<use href="#phantom-glyph"/>`) that currently rely on CSS sizing should get explicit `width`/`height` matching their rendered size. ~25 instances in index.html, ~0 inline SVGs directly in products.html HTML (the product glyphs are generated by JS — see step 5b).
- Note: the task asked for `loading="lazy"` on `<img>` tags below the fold in products.html. There are **no `<img>` tags** in either page; all graphics are inline SVGs. Document this as N/A in the commit message so the user knows it was considered, not forgotten.

**Step 5b — products.html JS-generated SVGs**: the `glyphs` object (around products.html line 438) produces SVG strings without `width`/`height`. Update each glyph template string to include `width="32" height="32"` alongside the existing `viewBox="0 0 32 32"`. ~6 glyph definitions.

### Step 6 — Generate placeholder binaries

Run a one-off Python script (Pillow) to produce:

- `favicon.ico` — 32×32, dark background (`#07060d` Void bg), white "P" (Space Grotesk-ish — fall back to default sans if Pillow can't load Google Fonts locally). Multi-size ICO not required; 32×32 is enough.
- `assets/apple-touch-icon.png` — 180×180, same palette, larger "P".
- `assets/og-image.png` — 1200×630, dark bg, centered "PHANTOM" wordmark + tagline "The payload that was never there." in a monospace-ish fallback font.

Script lives only in the session (not committed). If Pillow is unavailable, fall back to writing minimal valid binary headers directly, but Pillow should be present in this environment — confirm with `python3 -c "import PIL"` before running.

### Step 7 — Create `robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://cbaileydev.github.io/phantom/sitemap.xml
```

### Step 8 — Create `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cbaileydev.github.io/phantom/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cbaileydev.github.io/phantom/products.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

404.html is intentionally excluded — error pages should not be indexed.

### Step 9 — Create `404.html`

Minimal, on-brand, shares the external stylesheet so it inherits the Void default look. Structure:

- `<html lang="en">` (no `data-theme` — gets the Void default from `:root`)
- Same `<head>` as index.html but with `<title>Phantom — Signal Lost (404)</title>`, `<meta name="description" content="Signal lost. The resource you're looking for isn't here.">`, `<meta name="robots" content="noindex">`
- Body: reuse the `<nav>` + `.grid-bg` + halos, then a centered section with:
  - Eyebrow: `04.04 // SIGNAL_LOST`
  - Headline: `404 — Signal Lost`
  - Subline: short cyberpunk line ("The payload never arrived. This node is dark.")
  - CTA button linking `href="./"` — "Return to base"
- Minimal — no scripts, no tweaks panel. Keep total page weight under ~3 KB of new markup.

### Step 10 — Commit & push to `claude/phantom-refactor-seo-BVmf6`

Single commit covering all of the above with a descriptive message (one sentence explaining the why). Then `git push -u origin claude/phantom-refactor-seo-BVmf6`. Do **not** open a PR unless the user explicitly asks.

---

## Critical files referenced

| Path | Why |
|---|---|
| `/home/user/phantom/Phantom.html` (→ `index.html`) | CSS source lines 10–728; body/script unchanged; head replaced |
| `/home/user/phantom/products.html` | CSS source lines 10–259; JS glyph object ~line 438 gets width/height; head replaced; `<html data-theme="ember">` added |
| `/home/user/phantom/index.html` (old redirect) | Deleted by `git mv` |
| `/home/user/phantom/assets/css/phantom.css` | NEW — merged stylesheet |
| `/home/user/phantom/favicon.ico` | NEW — 32×32 binary |
| `/home/user/phantom/assets/apple-touch-icon.png` | NEW — 180×180 binary |
| `/home/user/phantom/assets/og-image.png` | NEW — 1200×630 binary |
| `/home/user/phantom/robots.txt` | NEW |
| `/home/user/phantom/sitemap.xml` | NEW |
| `/home/user/phantom/404.html` | NEW |

Existing utilities reused: the established CSS custom-property theme system (Void/Phosphor/Ember/Mono via `[data-theme=…]`), the existing `setTheme()` localStorage pattern in both JS blocks (no rewiring needed), the existing `.eyebrow`/`.nav`/`.container`/`.grid-bg` components for 404.html.

---

## Verification

1. **Local render sanity**: open `index.html`, `products.html`, and `404.html` directly in a browser (`file://…`). Confirm:
   - Landing page renders with Void (indigo/violet) theme by default.
   - Products page renders with Ember (amber/red) theme by default.
   - 404 page renders with Void and shows the "Signal Lost" message.
   - Nav, footer, scroll progress, tweaks panel all look identical to pre-refactor screenshots.
   - Theme switcher in tweaks panel cycles through all four themes on both content pages.

2. **Diff check**: `grep -r "<style" *.html` returns nothing. `grep -r "Phantom\.html" .` returns nothing (no dead redirect links). `grep -rn "loading=\"lazy\"" products.html` — note this is N/A (no `<img>` tags; documented in commit).

3. **Head audit** per page: `grep -E "og:|twitter:|description|favicon|apple-touch|preload" index.html products.html 404.html` — each page should have the appropriate tags.

4. **Sitemap + robots**: `cat robots.txt sitemap.xml` — verify content. Validate sitemap via `xmllint --noout sitemap.xml` if available.

5. **CSS integrity**: `wc -l assets/css/phantom.css` — expect ~900–950 lines (719 Phantom + ~200 products-only + minor reordering). Spot-check that Void, Phosphor, Ember, and Mono `[data-theme]` selectors are all present exactly once.

6. **Placeholder binaries**: `file favicon.ico assets/*.png` should report `MS Windows icon resource - 1 icon, 32 x 32` and `PNG image data, …` respectively — confirms valid files, not empty stubs.

7. **Social card preview** (optional, post-deploy): paste the deployed URL into https://www.opengraph.xyz/ after push to verify OG tags resolve to the new og-image.
