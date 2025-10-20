export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      const response = await fetch(
        `https://api.github.com/gists/${process.env.GIST_ID}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: {
              'gistfile1.txt': {
                content: body.content,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return res.status(200).json({ message: 'Guardado con éxito' });
    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
