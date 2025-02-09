import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/_lib/mercado-pago";

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, price } = await req.json();
    
    const preference = new Preference(mpClient);
    const createdPreference = await preference.create({
      body: {
        external_reference: userId,
        metadata: { userId },
        payer: userEmail ? { email: userEmail } : undefined,
        items: [
          {
            id: userId,
            title: "Plano Memorial SaaS",
            quantity: 1,
            unit_price: price,
            currency_id: "BRL",
          },
        ],
        // TESTUSER469406399
        // YpNXxuX7OK
        // TESTUSER215011834
        // ta5hFgR5Dz
        auto_return: "approved",
        back_urls: {
          success: `${req.headers.get("origin")}/sucesso`,
          failure: `${req.headers.get("origin")}/falha`,
          pending: `${req.headers.get("origin")}/pendente`,
        },
      },
    });

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Erro no processamento" },
      { status: 500 }
    );
  }
}