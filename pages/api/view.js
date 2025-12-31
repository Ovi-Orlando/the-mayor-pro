import { getGist, saveGist } from "./_gist";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const data = await getGist();
    const index = data.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "No encontrado" });
    }

    data[index].vistas = (data[index].vistas || 0) + 1;

    await saveGist(data);

    res.status(200).json({
      ok: true,
      vistas: data[index].vistas,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno" });
  }
}
