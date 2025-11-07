/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permite cargar imágenes externas (por ejemplo de archive.org)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.archive.org',
      },
      {
        protocol: 'https',
        hostname: '**.us.archive.org',
      },
      {
        protocol: 'https',
        hostname: 'ia601004.us.archive.org',
      }
    ],
  },

  // Permite que las variables de entorno estén accesibles
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GIST_ID: process.env.GIST_ID,
    GIST_FILENAME: process.env.GIST_FILENAME,
  },

  // Optimizaciones para despliegue en Vercel
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;

