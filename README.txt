The Mayor Pro — Netflix Edition (final package)

Included files:
- src/ (React app with Home, Admin, components)
- api/gist.js (serverless function to GET/POST the gist content)
- public/logo.png (your logo)

IMPORTANT: After you push to GitHub and connect to Vercel, add these Environment Variables in Vercel (Project Settings -> Environment Variables):

- VITE_GIST_RAW = https://gist.githubusercontent.com/Ovi-Orlando/58715e8bdc303394122d0fbf4605faf9/raw/98f2699f2807e6a51cab660731519386f93dea86/gistfile1.txt
- GIST_ID = 58715e8bdc303394122d0fbf4605faf9
- GIST_FILENAME = catalogo.json (optional)
- GITHUB_TOKEN = <your personal access token with gist scope>  (server-side only - do NOT prefix with VITE_)

Admin access:
- URL: /admin?key=admin_ovi
- Add / edit / delete entries and press 'Guardar' to update the Gist.

Categories:
- The Home page auto-detects genres from the 'genero' field in your JSON and shows them as chips to filter.

Notes:
- Provide direct MP4 links for 'video' field for smooth playback.
- If token was exposed, revoke it in GitHub and create a new one with 'gist' scope.
