import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import crypto from "crypto";

// -------------------------------
// Instância central do MP Client
// -------------------------------
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export default mpClient;

// Clientes reutilizáveis
export const mpPreference = new Preference(mpClient);
export const mpPayment = new Payment(mpClient);

// ------------------------------------------------------------------
// Verificação de assinatura do webhook do Mercado Pago
// Retorna true se a assinatura for válida, false caso contrário.
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/webhooks
// ------------------------------------------------------------------
export function verifyMercadoPagoSignature(request: Request): boolean {
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  const signatureParts = xSignature.split(",");
  let ts = "";
  let v1 = "";
  signatureParts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key.trim() === "ts") ts = value.trim();
    else if (key.trim() === "v1") v1 = value.trim();
  });

  if (!ts || !v1) return false;

  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id");

  let manifest = "";
  if (dataId) manifest += `id:${dataId};`;
  if (xRequestId) manifest += `request-id:${xRequestId};`;
  manifest += `ts:${ts};`;

  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET as string;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const generatedHash = hmac.digest("hex");

  return generatedHash === v1;
}