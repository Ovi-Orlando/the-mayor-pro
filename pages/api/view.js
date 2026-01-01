export default async function handler(req, res) {
  try {
    const { GIST_ID, GITHUB_TOKEN, GIST_FILENAME } = process.env;

    if (!GIST_ID) {
      return res.status(500).json({ error: "GIST_ID not set" });
    }

    const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: GITHUB_TOKEN
        ? { Authorization: `token ${GITHUB_TOKEN}` }
        : {},
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: "GitHub error: " + t });
    }

    const gist = await r.json();
    const filename =
      GIST_FILENAME || Object.keys(gist.files || {})[0] || "movies.json";

    let data = [];
    try {
      data = JSON.parse(gist.files[filename].content || "[]");
    } catch {
      data = [];
    }

    // 🔹 GET → devolver vistas
    if (req.method === "GET") {
      const views = {};
      data.forEach((item) => {
        if (item.id != null) {
          views[item.id] = item.views || 0;
        }
      });
      return res.status(200).json(views);
    }

    // 🔹 POST → incrementar vistas
    if (req.method === "POST") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Missing id" });
      }

      const updated = data.map((item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            views: (item.views || 0) + 1,
          };
        }
        return item;
      });

      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [filename]: {
              content: JSON.stringify(updated, null, 2),
            },
          },
        }),
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("view api error", err);
    return res.status(500).json({ error: String(err) });
  }
}
