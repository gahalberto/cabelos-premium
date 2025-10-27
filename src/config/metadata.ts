import { Metadata } from 'next';

// URL base do site (ajustar para produção)
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cabelospremium.com.br';

// Informações gerais do site
export const siteConfig = {
  name: 'Cabelos Premium',
  description: 'Os legítimos cabelos brasileiros do sul. Extensões e alongamentos naturais de alta qualidade.',
  url: siteUrl,
  ogImage: `${siteUrl}/images/logoouro.png`,
  keywords: [
    'cabelos naturais',
    'extensões capilares',
    'alongamento capilar',
    'cabelos brasileiros',
    'apliques',
    'mega hair',
    'cabelos premium',
    'cabelo natural',
    'extensão de cabelo',
    'loja de cabelos',
  ],
  author: 'Cabelos Premium',
  locale: 'pt_BR',
  type: 'website',
};

// Função helper para criar metadata consistente
export function createMetadata({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
  ogImage,
}: {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const fullTitle = title.includes('Cabelos Premium') ? title : `${title} | Cabelos Premium`;
  const url = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const image = ogImage || siteConfig.ogImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@cabelospremium',
    },

    // Canonical
    alternates: {
      canonical: url,
    },

    // Verificação (adicionar se tiver)
    // verification: {
    //   google: 'google-site-verification-code',
    //   yandex: 'yandex-verification-code',
    // },
  };
}

// Metadados específicos por página
export const pageMetadata = {
  home: createMetadata({
    title: 'Cabelos Premium | Extensões e Alongamentos Naturais',
    description: 'Descubra os melhores cabelos naturais e alongamentos profissionais com qualidade premium. Transforme seu visual com confiança e beleza.',
    canonical: '/',
    keywords: [
      ...siteConfig.keywords,
      'loja de cabelos naturais',
      'cabelos premium brasil',
      'extensão capilar profissional',
    ],
  }),

  sobre: createMetadata({
    title: 'Sobre a Cabelos Premium | Excelência em Transformação Capilar',
    description: 'Conheça a história e os valores da Cabelos Premium. Nossa missão é oferecer cabelos de alta qualidade e atendimento especializado.',
    canonical: '/sobre',
  }),

  shop: createMetadata({
    title: 'Loja Cabelos Premium | Compre Extensões e Apliques Naturais',
    description: 'Encontre cabelos naturais, apliques e alongamentos certificados. Produtos premium com entrega para todo o Brasil.',
    canonical: '/shop',
    keywords: [
      ...siteConfig.keywords,
      'comprar cabelos naturais',
      'loja online cabelos',
      'extensões para comprar',
    ],
  }),

  contato: createMetadata({
    title: 'Contato | Fale com a Equipe Cabelos Premium',
    description: 'Tire suas dúvidas e entre em contato com nossa equipe. Atendimento personalizado e suporte de segunda a sexta das 9h às 17h.',
    canonical: '/contato',
  }),

  colecao: createMetadata({
    title: 'Coleção Cabelos Premium | Conheça Nossos Produtos',
    description: 'Explore nossa coleção completa de cabelos naturais brasileiros. Qualidade superior, variedade de cores e texturas.',
    canonical: '/colecao',
  }),

  lancamento: createMetadata({
    title: 'Lançamentos | Novidades em Cabelos Premium',
    description: 'Confira os últimos lançamentos em extensões e alongamentos capilares. Tendências e novidades exclusivas.',
    canonical: '/lancamento',
  }),

  torneseExpert: createMetadata({
    title: 'Torne-se Expert | Seja Parceiro Cabelos Premium',
    description: 'Faça parte da nossa rede de experts. Cadastre-se e comece a trabalhar com os melhores cabelos naturais do Brasil.',
    canonical: '/torne-se-expert',
  }),

  wishlist: createMetadata({
    title: 'Lista de Desejos | Cabelos Premium',
    description: 'Seus produtos favoritos salvos. Gerencie sua lista de desejos e finalize sua compra quando quiser.',
    canonical: '/wishlist',
  }),

  cart: createMetadata({
    title: 'Carrinho de Compras | Cabelos Premium',
    description: 'Revise seus produtos e finalize sua compra com segurança. Entrega para todo o Brasil.',
    canonical: '/cart',
  }),

  politicaPrivacidade: createMetadata({
    title: 'Política de Privacidade | Cabelos Premium',
    description: 'Conheça nossa política de privacidade e como protegemos seus dados pessoais.',
    canonical: '/politica-privacidade',
  }),

  termosUso: createMetadata({
    title: 'Termos de Uso | Cabelos Premium',
    description: 'Leia nossos termos de uso e condições para utilização do site e compra de produtos.',
    canonical: '/termos-uso',
  }),
};

