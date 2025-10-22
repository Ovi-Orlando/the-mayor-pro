export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { content } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const response = await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [process.env.GIST_FILENAME || 'movies.json']: {
            content
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error en GitHub API:', error);
      return res.status(500).json({ error: 'Error al guardar en Gist' });
    }

    return res.status(200).json({ message: 'Guardado con éxito' });
  } catch (error) {
    console.error('Error interno:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
