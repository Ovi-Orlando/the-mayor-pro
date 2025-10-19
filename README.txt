The Mayor Pro — Final package (prepared for Ovi-Orlando)

Included files:
- src/ (React app)
- api/gist.js (serverless to PATCH your gist)
- public/logo.png (your logo image)

IMPORTANT - After pushing to GitHub and connecting to Vercel, set these Environment Variables in Vercel (Project Settings -> Environment Variables):

- VITE_GIST_RAW = https://gist.githubusercontent.com/Ovi-Orlando/58715e8bdc303394122d0fbf4605faf9/raw/8853c9c0aedae09b282a1c9f5e4f1d09f496375b/gistfile1.txt
- GIST_ID = 58715e8bdc303394122d0fbf4605faf9
- GIST_FILENAME = catalogo.json
- GITHUB_TOKEN = <your personal token with gist scope> (server-side only, do NOT prefix with VITE_)

Admin access:
- URL: /admin?key=admin_ovi
- Add / edit / delete entries and press 'Guardar' to update the Gist.

Notes on video playback:
- Player uses HTML5 <video>. Provide direct MP4 URLs in the 'video' field of your gist. Archive.org direct links should work.
- If your token was exposed anywhere, revoke it in GitHub settings and create a new one with 'gist' scope.

Enjoy! - Generated for you
