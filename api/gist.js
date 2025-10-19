// api/gist.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { method } = req;

    if (method === "GET") {
      // Leer el contenido del Gist
      const response = await fetch(
        `https://api.github.com/gists/${process.env.GIST_ID}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
      const gist = await response.json();
      const content = gist.files["gistfile1.txt"].content;
      res.status(200).json(JSON.parse(content));
    }

    else if (method === "POST") {
      // Guardar nueva película o serie
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => resolve(JSON.parse(data)));
        req.on("error", reject);
      });

      // Leer el Gist actual
      const response = await fetch(
        `https://api.github.com/gists/${process.env.GIST_ID}`,
        {
          headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
        }
      );
      const gist = await response.json();
      const content = JSON.parse(gist.files["gistfile1.txt"].content);

      // Agregar la nueva película
      const nueva = { id: Date.now(), ...body };
      content.push(nueva);

      // Actualizar el Gist
      await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            "gistfile1.txt": {
              content: JSON.stringify(content, null, 2),
            },
          },
        }),
      });

      res.status(200).json({ success: true, message: "Película agregada." });
    }

    else {
      res.status(405).json({ message: "Método no permitido." });
    }
  } catch (error) {
    console.error("Error en /api/gist:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
