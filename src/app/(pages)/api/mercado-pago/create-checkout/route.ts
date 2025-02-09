import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/_lib/mercado-pago";
import { db } from "@/app/_lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { testeId, userEmail } = await req.json();

    const userAlreadyExist = await db.user.findFirst({
      where: userEmail
    })

    if(userAlreadyExist) throw new Error("User already exists");

    const user =  await db.user.create({
      data: {
        email: userEmail,
        password: '12345678910',
      }
    })
    
    const preference = new Preference(mpClient);
    const createdPreference = await preference.create({
      body: {
        external_reference: testeId,
        metadata: { testeId },
        payer: userEmail ? { email: userEmail } : undefined,
        items: [
          {
            id: "123",
            title: "Plano Memorial",
            quantity: 1,
            unit_price: 49.9,
            currency_id: "BRL",
          },
        ],
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
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Erro no processamento" },
      { status: 500 }
    );
  }
}