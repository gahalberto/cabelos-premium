export default {
  images: {
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "upload.wikimedia.org",
      "inmemorian.com.br", // 🔥 Permite carregar imagens do seu próprio domínio
    ],
    unoptimized: true, // 🔥 Evita que Next.js tente otimizar imagens locais
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  api: {
    bodyParser: true,
  },
  env: {
    NEXT_PUBLIC_ASAAS: process.env.NEXT_PUBLIC_ASAAS,
  },
};
