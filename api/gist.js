export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const gistId = process.env.GIST_ID;
      const token = process.env.GITHUB_TOKEN;
      if (!gistId) return res.status(500).json({ error: 'GIST_ID not set' });
      const r = await fetch(`https://api.github.com/gists/${gistId}`, { headers: token ? { Authorization: `token ${token}` } : {} });
      const gist = await r.json();
      const filename = Object.keys(gist.files || {})[0];
      const content = gist.files?.[filename]?.content || '[]';
      return res.status(200).json(JSON.parse(content));
    }

    if (req.method === 'POST') {
      // expects body: { items: [...] }
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });

      const items = body.items;
      if (!items) return res.status(400).json({ error: 'Missing items' });

      const gistId = process.env.GIST_ID;
      const token = process.env.GITHUB_TOKEN;
      if (!gistId || !token) return res.status(500).json({ error: 'GIST_ID or GITHUB_TOKEN not set' });

      // fetch gist to get filename
      const g = await fetch(`https://api.github.com/gists/${gistId}`, { headers: { Authorization: `token ${token}` } });
      const gist = await g.json();
      const filename = Object.keys(gist.files || {})[0] || 'catalogo.json';

      const content = JSON.stringify(items, null, 2);
      const patch = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: { [filename]: { content } } })
      });

      if (!patch.ok) {
        const text = await patch.text();
        return res.status(500).json({ error: 'GitHub API error', detail: text });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/gist error', err);
    return res.status(500).json({ error: String(err) });
  }
}
