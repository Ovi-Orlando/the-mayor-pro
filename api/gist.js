// api/gist.js
import fetch from "node-fetch";

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const gistUrl = process.env.GIST_URL;
      const res = await fetch(gistUrl);
      const data = await res.json();
      return response.status(200).json(data);
    }

    if (request.method === "POST") {
      const body = await request.json?.() || JSON.parse(request.body);
      const token = process.env.GITHUB_TOKEN;
      const gistId = process.env.GIST_ID;

      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "gistfile1.txt": {
              content: JSON.stringify(body, null, 2),
            },
          },
        }),
      });

      const result = await res.json();
      return response.status(200).json({ ok: true, result });
    }

    return response.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}
