import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ──────────────────────────────────────────────────────────────────
//  Kill Switch — bloqueia TUDO exceto:
//    /offline         → página de aviso ao visitante
//    /api/ctrl/*      → endpoint secreto do Admin Master
//    /_next/*         → assets internos do Next.js (CSS, JS, fontes)
// ──────────────────────────────────────────────────────────────────
const ALWAYS_ALLOWED = [
  '/offline',
  '/api/ctrl/',
  '/_next/',
];

/**
 * Retorna false (matar o site) quando:
 *   - SITE_ACTIVE === "false", OU
 *   - SITE_EXPIRY_DATE estiver definida e a data já passou.
 */
function isSiteActive(): boolean {
  if (process.env.SITE_ACTIVE === 'false') return false;

  const expiry = process.env.SITE_EXPIRY_DATE;
  if (expiry) {
    const d = new Date(expiry);
    if (!isNaN(d.getTime()) && new Date() > d) return false;
  }

  return true;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas sempre permitidas (offline page + endpoint secreto + assets)
  if (ALWAYS_ALLOWED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Kill switch ativo → redireciona absolutamente tudo
  if (!isSiteActive()) {
    const url = req.nextUrl.clone();
    url.pathname = '/offline';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Captura todas as rotas, exceto arquivos estáticos puros
  matcher: [
    '/((?!_next/static|_next/image|images|fonts|videos|uploads|photos|manifest\\.json|robots\\.txt|favicon\\.ico).*)',
  ],
};
