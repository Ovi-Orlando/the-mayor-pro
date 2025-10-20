export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // Parseamos el cuerpo correctamente
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Hacemos la solicitud a GitHub Gist
      const response = await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [process.env.GIST_FILENAME || 'gistfile1.txt']: {
              content: body.content,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API error:', errorText);
        return res.status(500).json({ error: 'Error al guardar en Gist' });
      }

      return res.status(200).json({ message: 'Guardado con éxito' });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error('Error interno:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
