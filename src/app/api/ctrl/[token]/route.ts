import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ──────────────────────────────────────────────────────────────────
//  Endpoint secreto de controle do Kill Switch
//  URL:  /api/ctrl/<KILL_SWITCH_SECRET>?action=off|on
//  Apenas o Admin Master conhece este endereço.
// ──────────────────────────────────────────────────────────────────

const ENV_PATH = path.join(process.cwd(), '.env');

/** Lê o .env e troca o valor de SITE_ACTIVE sem perder as outras variáveis. */
function setSiteActive(active: boolean) {
  const raw = fs.readFileSync(ENV_PATH, 'utf-8');
  const updated = raw.replace(
    /^SITE_ACTIVE=".+?"$/m,
    `SITE_ACTIVE="${active ? 'true' : 'false'}"`,
  );
  fs.writeFileSync(ENV_PATH, updated, 'utf-8');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  const secret = process.env.KILL_SWITCH_SECRET;

  // ── Validação do token ─────────────────────────────────────────
  if (!secret || params.token !== secret) {
    // Responde como 404 para não revelar a existência da rota
    return new NextResponse(null, { status: 404 });
  }

  const action = req.nextUrl.searchParams.get('action');

  if (action !== 'on' && action !== 'off') {
    return NextResponse.json(
      {
        error: 'Parâmetro inválido. Use ?action=on ou ?action=off',
        current: process.env.SITE_ACTIVE,
      },
      { status: 400 },
    );
  }

  const turningOn = action === 'on';

  // ── Atualiza o .env ────────────────────────────────────────────
  try {
    setSiteActive(turningOn);
  } catch (err) {
    return NextResponse.json(
      { error: 'Falha ao atualizar .env', detail: String(err) },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    action,
    message: turningOn
      ? '✅ Site será reativado em ~3s (PM2 reiniciando…)'
      : '🔴 Site será desativado em ~3s (PM2 reiniciando…)',
  });

  // ── Reinicia o processo via PM2 (autorestart) ──────────────────
  // process.exit(0) → PM2 detecta saída e reinicia com o .env atualizado.
  // O response já foi montado; o cliente recebe antes do exit.
  setImmediate(() => {
    console.log(`[KillSwitch] Ação: ${action.toUpperCase()} — reiniciando processo...`);
    process.exit(0);
  });

  return response;
}
