# AI Yatri — Source Code

This is a framework-free prototype (HTML + vanilla JS + CSS). The static HTML still works by itself with an offline travel fallback. For natural AI chat, run the included Node server with an Anthropic API key.

## Run AI chat locally
1. Set `ANTHROPIC_API_KEY` in your terminal.
2. Run `node server.js` from this folder.
3. Open `http://localhost:3000` instead of opening the HTML file directly.

PowerShell example:
```powershell
$env:ANTHROPIC_API_KEY = "your-key-here"
node server.js
```

For the Google Maps Embed API mode, also set a restricted browser key before starting the server:
```powershell
$env:GOOGLE_MAPS_API_KEY = "your-google-maps-key"
node server.js
```

The Anthropic key stays on the server and is never included in the browser. The Google Maps key is injected only when the local server serves the page. Without it, the app still shows a Google Maps search embed and a full-map link. If the server is unavailable, Traveller Chat uses its built-in offline travel responses.

Authentication is a local browser demo: new users must register with a name, email, password, and confirmation before logging in. Account records are stored in `localStorage` under `ai-yatri-accounts`; the active session is stored under `ai-yatri-session`. Passwords use a lightweight client-side hash for this prototype. Use a real identity provider and server-side password hashing before production use.

## Files
- **ai-yatri.html** — the finished, self-contained app (open this directly in a browser, or upload it anywhere). All CSS, JS, and images are inlined into this one file, so it's the only file you actually need to run the app.
- **index_template.html** — the HTML shell/template *before* the pieces below were inlined into it. Placeholders like `__CSS__`, `__DATA_JS__`, `__APP_JS__`, `__RENDER_JS__`, and `__IMG_*__` mark where each file below gets injected.
- **data.js** — all destination content: Guwahati, Shillong, Kaziranga (spots, stays, transport generator, local mobility, safety notes, culture/festivals) plus the mock-transport pricing logic.
- **app.js** — application state, the persona/chat logic (scripted flow + live Claude API calls with fallback), itinerary generation (AI call + rule-based fallback), and budget/offline helpers.
- **render.js** — all UI rendering: builds the HTML for each screen (Home, Itinerary, Map, Chat, Profile) and wires up event listeners.
- **server.js** — optional local Node server for secure AI chat and Google Maps key injection.
- **style.css** — the full design system (colors, type, the postcard/ticket/passport-stamp motifs, responsive layout).

## How the files fit together
`index_template.html` loads `style.css` inside a `<style>` tag and `data.js` → `app.js` → `render.js` in that order inside `<script>` tags (order matters: data before logic before rendering). The images referenced as `IMG.home`, `IMG.chat`, etc. are the 6 photos you uploaded, base64-encoded into the `IMG` object at the top of the script block.

The build step (not included as a script here, but described below) just does simple string substitution — reads each file, drops it into the matching `__PLACEHOLDER__` in the template, and writes out one flat `ai-yatri.html`. If you want to keep editing the split files instead of the merged one, that substitution is trivial to redo:

```python
tpl = open('index_template.html').read()
tpl = tpl.replace('__CSS__', open('style.css').read())
tpl = tpl.replace('__DATA_JS__', open('data.js').read())
tpl = tpl.replace('__APP_JS__', open('app.js').read())
tpl = tpl.replace('__RENDER_JS__', open('render.js').read())
# __IMG_*__ placeholders expect base64 strings, e.g.:
# tpl = tpl.replace('__IMG_HOME__', base64.b64encode(open('hero_home.jpg','rb').read()).decode())
open('ai-yatri.html','w').write(tpl)
```

## Notes for extending this
- **AI calls**: `app.js` calls `https://api.anthropic.com/v1/messages` directly from the browser for chat and itinerary generation. This only works inside the Claude.ai artifact/API-proxy environment — outside it you'd get a CORS error, which is why every AI call is wrapped in try/catch with a deterministic fallback (scripted chat flow, rule-based itinerary sort).
- **Data**: destination content in `data.js` is manually researched sample data for a hackathon demo, not pulled from a live API — transport prices, hotel names, and the safety layer are all explicitly labeled as demo/illustrative in the UI.
- **No build tools**: everything is vanilla JS with template-string rendering (no React/Vue, no bundler). This keeps it runnable as one static file, but if you migrate to the React+TS+Tailwind stack from the original brief, `data.js`'s destination objects and `app.js`'s state shape should port over almost directly.
