import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Servidor de avatares de Google
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Servidor de avatares de GitHub (opcional)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // <-- NUEVO: Para el avatar de la Demo
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
