// next.config.mjs
export default {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'upload.wikimedia.org'], // Adicione os domínios permitidos
  },
  eslint: {
    // Ignorar os erros do ESLint durante o build
    ignoreDuringBuilds: true,
  },
  api: {
    bodyParse: true,
  },
  env: {
    NEXT_PUBLIC_ASAAS: process.env.NEXT_PUBLIC_ASAAS,
  },
};
