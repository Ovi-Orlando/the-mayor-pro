export default async function handler(req, res) {
  try {
    const { GIST_ID, GITHUB_TOKEN, GIST_FILENAME } = process.env;

    if (!GIST_ID) {
      return res.status(500).json({ error: 'GIST_ID not set' });
    }

    const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: 'GitHub error: ' + t });
    }

    const gist = await r.json();
    const filename =
      GIST_FILENAME || Object.keys(gist.files || {})[0] || 'movies.json';
    const raw = gist.files?.[filename]?.content || '[]';

    let data = [];

    try {
      const parsed = JSON.parse(raw);
      data = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Invalid JSON in Gist:", err);
      data = [];
    }

    // --- 🔥 SANITIZACIÓN AUTOMÁTICA ---
    const cleaned = data
      .filter(item => item && typeof item === "object")
      .map(item => {
        const fixed = { ...item };

        // Normaliza keys mal escritas
        if (fixed["vídeo"]) {
          fixed.video = fixed["vídeo"];
          delete fixed["vídeo"];
        }

        // Valores vacíos → null
        ["title", "poster", "video", "description"].forEach(key => {
          if (fixed[key] === "" || fixed[key] === undefined) {
            fixed[key] = null;
          }
        });

        // Si poster o video están en null → evita romper front-end
        if (!fixed.poster) fixed.poster = "/placeholder.png";
        if (!fixed.video) fixed.video = "";

        return fixed;
      });

    return res.status(200).json(cleaned);

  } catch (err) {
    console.error('gist api error', err);
    return res.status(500).json({ error: String(err) });
  }
}
