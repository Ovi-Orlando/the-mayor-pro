export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { GIST_ID, GITHUB_TOKEN, GIST_FILENAME } = process.env;
    if(!GIST_ID || !GITHUB_TOKEN) return res.status(500).json({ error: 'Missing GIST_ID or GITHUB_TOKEN' });
    const body = req.body;
    const movies = body.movies || body.items || body;
    if(!movies) return res.status(400).json({ error: 'Missing movies in body' });
    const gistUrl = `https://api.github.com/gists/${GIST_ID}`;
    const r = await fetch(gistUrl, { method:'PATCH', headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type':'application/json' }, body: JSON.stringify({ files: { [GIST_FILENAME || 'movies.json']: { content: JSON.stringify(movies, null, 2) } } }) });
    if(!r.ok){ const t = await r.text(); return res.status(500).json({ error: 'GitHub API error: '+t }) }
    const data = await r.json(); return res.status(200).json({ ok:true, data });
  } catch(err){ console.error('save api error', err); return res.status(500).json({ error: String(err) }) }
}
