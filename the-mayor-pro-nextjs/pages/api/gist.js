export default async function handler(req, res) {
  try {
    const { GIST_ID, GITHUB_TOKEN, GIST_FILENAME } = process.env;
    if(!GIST_ID) return res.status(500).json({ error: 'GIST_ID not set' });
    const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, { headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {} });
    if(!r.ok){ const t = await r.text(); return res.status(500).json({ error: 'GitHub error: '+t }) }
    const gist = await r.json();
    const filename = GIST_FILENAME || Object.keys(gist.files||{})[0] || 'movies.json';
    const content = gist.files?.[filename]?.content || '[]';
    return res.status(200).json(JSON.parse(content));
  } catch(err){
    console.error('gist api error', err); return res.status(500).json({ error: String(err) })
  }
}
