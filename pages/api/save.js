export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { GIST_ID, GITHUB_TOKEN, GIST_FILENAME } = process.env;

    if (!GIST_ID || !GITHUB_TOKEN)
      return res
        .status(500)
        .json({ error: 'Missing GIST_ID or GITHUB_TOKEN' });

    const body = req.body;

    // Asegurar que movies existe y es array
    const movies =
      body
