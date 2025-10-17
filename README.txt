The Mayor Pro — Video player (HTML5)

Overview
- React + Vite project with admin panel and serverless API to update a GitHub Gist catalog.
- The player uses an HTML5 <video> element for direct streaming of MP4 URLs.

Setup (quick)
1) Create secret gist (filename: catalogo.json) with initial content: []
2) In Vercel, set env vars:
   - VITE_GIST_RAW = <raw gist url>
   - GIST_ID = <gist id>
   - GIST_FILENAME = catalogo.json
   - GITHUB_TOKEN = <personal token with gist scope>
3) Deploy to Vercel. Access /admin with key 'admin_ovi' to add/edit/delete entries.

Notes on video playback
- Prefer direct MP4 URLs from a host/CDN that supports range requests for seeking.
- Google Drive links often don't work as direct MP4 sources; use Drive 'export=download' links or host files on a CDN.
