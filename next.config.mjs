export default {
  images: {
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "upload.wikimedia.org",
      "inmemorian.com.br", 
    ],
    unoptimized: true, 
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
  async rewrites() {
    return [
      {
        source: "/photos/:path*", // 🔥 Evita que o Next.js processe essa rota
        destination: "/public/photos/:path*",
      },
    ];
  },
};
