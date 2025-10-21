The Mayor Pro — Final package (prepared for new Gist)

Included files:
- src/ (React app with Home, Admin, components)
- api/gist.js (serverless function to GET/POST the gist content)
- public/logo.png (your logo)

IMPORTANT: After you push to GitHub and connect to Vercel, set these Environment Variables in Vercel (Project Settings -> Environment Variables):

- VITE_GIST_RAW = https://gist.githubusercontent.com/Ovi-Orlando/2130bc7e621b0b1785d777180772092d/raw/movies.json
- GIST_ID = 2130bc7e621b0b1785d777180772092d
- GIST_FILENAME = movies.json
- GITHUB_TOKEN = <your personal access token with gist scope>  (server-side only - do NOT prefix with VITE_)

Admin access:
- URL: /admin?key=admin_ovi
- Add / edit / delete entries and press 'Guardar' to update the Gist.

Notes:
- Provide direct MP4 links for 'video' field for smooth playback.
- If token was exposed, revoke it in GitHub and create a new one with 'gist' scope.
