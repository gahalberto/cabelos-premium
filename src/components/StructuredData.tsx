import Script from 'next/script';
import { siteConfig } from '@/config/metadata';

interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'Product' | 'LocalBusiness';
  data?: Record<string, any>;
}

export function StructuredData({ type = 'Organization', data }: StructuredDataProps) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
  };

  let structuredData = {};

  switch (type) {
    case 'Organization':
      structuredData = {
        ...baseStructuredData,
        '@type': 'Organization',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/logoouro.png`,
        image: siteConfig.ogImage,
        sameAs: [
          'https://instagram.com/cabelospremium',
          'https://tiktok.com/@cabelospremium',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-11-3825-2050',
          contactType: 'Customer Service',
          areaServed: 'BR',
          availableLanguage: ['Portuguese'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Rua Dr. Albuquerque Lins, 537',
          addressLocality: 'São Paulo',
          addressRegion: 'SP',
          addressCountry: 'BR',
        },
      };
      break;

    case 'WebSite':
      structuredData = {
        ...baseStructuredData,
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };
      break;

    case 'LocalBusiness':
      structuredData = {
        ...baseStructuredData,
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#localbusiness`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: '+55-11-3825-2050',
        image: siteConfig.ogImage,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Rua Dr. Albuquerque Lins, 537',
          addressLocality: 'São Paulo',
          addressRegion: 'SP',
          postalCode: '01234-000',
          addressCountry: 'BR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '-23.550520',
          longitude: '-46.633308',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00',
          },
        ],
        priceRange: '$$',
      };
      break;

    case 'Product':
      structuredData = {
        ...baseStructuredData,
        ...data,
      };
      break;

    default:
      structuredData = {
        ...baseStructuredData,
        ...data,
      };
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

