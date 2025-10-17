export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = await req.json()
    const items = body.items
    if (!items) return res.status(400).json({ error: 'Missing items' })

    const GIST_ID = process.env.GIST_ID
    const FILENAME = process.env.GIST_FILENAME || 'catalogo.json'
    const TOKEN = process.env.GITHUB_TOKEN

    if (!GIST_ID) return res.status(500).json({ error: 'GIST_ID not set' })
    if (!TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN not set' })

    const content = JSON.stringify(items, null, 2)

    const patch = await fetch('https://api.github.com/gists/' + GIST_ID, {
      method: 'PATCH',
      headers: {
        'Authorization': 'token ' + TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({ files: { [FILENAME]: { content } } })
    })

    if (!patch.ok) {
      const text = await patch.text()
      return res.status(500).json({ error: 'GitHub API error', detail: text })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error', detail: String(err) })
  }
}
