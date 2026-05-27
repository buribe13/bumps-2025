## Learned User Preferences

- Prefers clean, minimal code — avoids verbose debug logging and dead code
- For sensitive values (API keys), prefers to be told which file to edit rather than having the agent make the change
- Uses port 3000 for local development
- Wants the app accessible to any Spotify user (not restricted to dev-registered accounts)
- Prefers smooth drag, pickup, and rotation interactions on fortunes — hover/control UI should stay active while manipulating

## Learned Workspace Facts

- Static site: vanilla HTML, CSS, JS — no npm, no build system, no bundler; Three.js loaded via CDN for fortune paper animations
- Local dev server: `python3 server.py` on port 3000 (serves static files and proxies OpenAI API to avoid CORS); VS Code Live Server also configured on port 3000
- Spotify Web API with PKCE auth; redirect URI is `http://127.0.0.1:3000/index.html` locally (Spotify requires 127.0.0.1, not localhost)
- OpenAI API key lives in `config.js` (gitignored); `config.example.js` is the committed template with placeholder
- Deploy target is GitHub Pages; deploy workflow injects `OPENAI_API_KEY` from repository secret at build time
- Spotify Client ID is in `app.js`; the app is currently in Spotify Development Mode
- Auth UI uses FAB buttons (`#loginButton`, `#logoutButton`); no auth-bar
- Page background: multi-stop gradient derived from active song cover art (4 colors, grain overlay); no background/info customizer FABs
- Fortune generations: Three.js full-viewport canvas; active fortune rolls out center-screen; past fortunes scatter at random viewport positions and are draggable with corner rotation handles; no right-side fortune panel
