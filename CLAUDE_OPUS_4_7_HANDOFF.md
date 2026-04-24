# Claude Opus 4.7 Max Handoff: Phantom Premium Website

## Context

Project path:

`/Users/carterbarker/Documents/phantom`

Current browser URL:

`file:///Users/carterbarker/Documents/phantom/index.html#team`

User direction:

- Remove the Style Lab.
- Use only the Synth theme.
- Keep the Topo background, but make it look more premium.
- Make the site feel like a professional product built by a small team.
- Reduce clutter and reading.
- Ensure the site works well across desktop, mobile, and resizes.

This is a static HTML/CSS/JS site. The folder is not currently a git repo.

## Work Already Done

### `index.html`

- Removed the live Style Lab section.
- Removed the floating tweak/theme controls.
- Added a new `#team` studio/team section with five cards:
  - Product engineering
  - Security review
  - Automation systems
  - Design & QA
  - Client operations
- Updated nav to include `Team` instead of Style Lab.
- Updated CTA link from Style Lab to `#team`.
- Replaced inline product teaser styles with CSS classes:
  - `.product-strip`
  - `.product-link`
  - `.product-link.featured`
  - `.product-strip-action`
- Removed the old speed/scan/grid UI script block.

### `products.html`

- Removed the live Style Lab / compact lab section.
- Removed floating tweak/theme controls.
- Updated nav to include `Team`.
- Added a `catalog-proof` section after the product grid:
  - Studio built / One product team
  - Scoped delivery / Clear handoff
  - Consistent system / Synth + Topo

### `404.html`

- Changed the third nav link from Style Lab to `index.html#team`.

### `assets/js/phantom-explorer.js`

- Replaced the theme/background picker behavior with fixed brand enforcement:
  - `data-theme="synth"`
  - `data-bg="topo"`
  - `data-default-theme="synth"`
  - `data-default-bg="topo"`
- Removed localStorage theme/background handling.
- Removed deck/render/tweak logic.
- Kept:
  - mobile nav toggle
  - reveal index assignment
  - pointer tilt animation
- Public debug surface is now:

```js
window.PhantomExplorer = {
  theme: 'synth',
  background: 'topo',
  enforceBrand
}
```

### `assets/css/phantom.css`

- Added a final fixed-brand premium system block near the end of the file.
- Enforced Synth variables on `:root` and `:root[data-theme="synth"]`.
- Added safety hiding:

```css
.tweaks,
.tweaks-toggle,
.style-lab {
  display: none !important;
}
```

- Improved Topo background with:
  - responsive `clamp(...)` background sizing
  - layered contour gradients
  - softer mobile opacity
  - more premium nav shadow/background treatment
- Added CSS for:
  - `.studio-block`
  - `.team-grid`
  - `.team-card`
  - `.catalog-proof`
  - `.proof-grid`
  - `.proof-card`
  - `.product-strip`
  - `.product-link`
  - `.product-strip-action`
- Added responsive rules for team grids, proof cards, product strip, nav CTA visibility, and mobile topo density.

Important caveat:

Old CSS for Style Lab, theme decks, and tweak controls still exists earlier in `assets/css/phantom.css`, but the live HTML/JS no longer uses it and the final CSS block hides `.style-lab`, `.tweaks`, and `.tweaks-toggle`. If there is time, clean the legacy CSS to reduce file weight. Do not reintroduce the UI.

## Checks Already Run

From `/Users/carterbarker/Documents/phantom`:

```bash
node --check assets/js/phantom-explorer.js
```

Passed.

```bash
node <<'NODE'
const fs = require('fs');
const vm = require('vm');
for (const file of ['products.html', 'index.html']) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => new vm.Script(match[1], { filename: `${file}:inline:${index + 1}` }));
  console.log(`${file}: ${scripts.length} inline script(s) parse`);
}
NODE
```

Passed:

```text
products.html: 1 inline script(s) parse
index.html: 1 inline script(s) parse
```

```bash
rg -n "style-lab|Style Lab|tweaks|theme-opt|bg-opt|data-theme-deck|data-bg-deck|data-randomize-look|data-current-look|phantom-theme|phantom-bg|speedSlider|scanToggle|gridToggle|Change look|Pick the vibe|Keep the look" index.html products.html 404.html assets/js/phantom-explorer.js
```

No matches in live HTML/JS.

```bash
rg -n "<style>|href=\"#\"|TODO|payload|Trojan|obfuscate|syscall|string encryption|ghosts|evasion|bypass|HWID|shellcode|NtCreateThreadEx|sleep masking|without paper trails|tokens|members|boosts|unverified|email-verified" index.html products.html 404.html assets/css/phantom.css assets/js/phantom-explorer.js
```

No matches.

Note:

Running `rg` against `assets/css/phantom.css` for `style-lab` or `tweaks` still finds legacy CSS plus the final safety-hide block. That is expected unless you choose to clean legacy CSS.

## Browser Verification Still Needed

Use the in-app browser first, since the user has it open.

Suggested Browser Use setup from Node REPL:

```js
if (!globalThis.agent) {
  const { setupAtlasRuntime } = await import('/Users/carterbarker/.codex/plugins/cache/openai-bundled/browser-use/0.1.0-alpha1/scripts/browser-client.mjs');
  await setupAtlasRuntime({ globals: globalThis, backend: 'iab' });
}
await agent.browser.nameSession('Phantom premium fixed brand');
if (!globalThis.tab) {
  globalThis.tab = await agent.browser.tabs.selected() || await agent.browser.tabs.new();
}
```

Verify `products.html`:

```js
await tab.goto('file:///Users/carterbarker/Documents/phantom/products.html');
await tab.waitForLoadState?.('domcontentloaded');
const productAudit = await tab.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  bg: document.documentElement.dataset.bg,
  styleLab: document.querySelectorAll('.style-lab').length,
  tweaks: document.querySelectorAll('.tweaks, .tweaks-toggle').length,
  cards: document.querySelectorAll('.card').length,
  proofCards: document.querySelectorAll('.proof-card').length,
  scrollOverflow: document.documentElement.scrollWidth - window.innerWidth
}));
productAudit;
```

Expected:

- `theme: "synth"`
- `bg: "topo"`
- `styleLab: 0`
- `tweaks: 0`
- product cards visible
- `proofCards: 3`
- `scrollOverflow <= 1`

Verify `index.html`:

```js
await tab.goto('file:///Users/carterbarker/Documents/phantom/index.html');
await tab.waitForLoadState?.('domcontentloaded');
const homeAudit = await tab.evaluate(() => ({
  theme: document.documentElement.dataset.theme,
  bg: document.documentElement.dataset.bg,
  styleLab: document.querySelectorAll('.style-lab').length,
  tweaks: document.querySelectorAll('.tweaks, .tweaks-toggle').length,
  teamCards: document.querySelectorAll('.team-card').length,
  productLinks: document.querySelectorAll('.product-link').length,
  scrollOverflow: document.documentElement.scrollWidth - window.innerWidth
}));
homeAudit;
```

Expected:

- `theme: "synth"`
- `bg: "topo"`
- `styleLab: 0`
- `tweaks: 0`
- `teamCards: 5`
- `productLinks: 6`
- `scrollOverflow <= 1`

Also take visible screenshots of:

- `index.html` first viewport
- `index.html#team`
- `products.html` first viewport
- `products.html` product cards / proof section

## Mobile/Desktop Responsive Verification

If Playwright is available, run a viewport audit for `390x844`, `768x1024`, and `1440x1000`.

Example:

```js
const { chromium } = await import('playwright');
const browser = await chromium.launch({ headless: true });
for (const [name, viewport] of Object.entries({
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 1000 }
})) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  for (const file of ['index.html', 'products.html']) {
    await page.goto(`file:///Users/carterbarker/Documents/phantom/${file}`);
    await page.waitForLoadState('domcontentloaded');
    const audit = await page.evaluate(() => ({
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      theme: document.documentElement.dataset.theme,
      bg: document.documentElement.dataset.bg,
      styleLab: document.querySelectorAll('.style-lab').length,
      tweaks: document.querySelectorAll('.tweaks, .tweaks-toggle').length,
      teamCards: document.querySelectorAll('.team-card').length,
      proofCards: document.querySelectorAll('.proof-card').length
    }));
    console.log(name, file, audit, errors);
  }
  await page.close();
}
await browser.close();
```

If Playwright is not available, use the in-app browser screenshots and manually resize the browser window if possible.

## Likely Next Polish

Prioritize these if anything looks off:

1. Clean old unused Style Lab/theme/tweak CSS from `assets/css/phantom.css` to reduce bloat.
2. Check mobile product cards for overlong text or horizontal overflow.
3. Check Topo density on mobile; if it feels noisy, lower `.grid-bg` opacity or increase background-size inside the mobile media query.
4. Check `index.html#team` cards for text density. The user wants premium but low-reading.
5. Keep Synth + Topo fixed. Do not add a visible theme picker.

## User-Facing Summary To Give When Done

Keep it short:

- Style Lab and theme controls were removed from the live site.
- Synth + Topo is now the fixed brand direction.
- Added a professional team/studio section and product proof cards.
- Improved Topo background and responsive layouts.
- Static parse/content checks passed.
- Browser and responsive checks passed, or mention the exact remaining limitation if not.
