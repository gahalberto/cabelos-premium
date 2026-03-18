import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Cabelos Premium <noreply@cabelospremium.com.br>";
const BASE_URL = process.env.NEXTAUTH_URL || "https://cabelospremium.com.br";

const brandColor = "#8a7d5c";

function emailLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F4F0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#1a1611;letter-spacing:2px;">
                CABELOS PREMIUM
              </span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;padding:40px 48px;border:1px solid #e8e4dc;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0 0;">
              <p style="color:#9a9585;font-size:12px;margin:0;font-family:Helvetica,sans-serif;">
                © ${new Date().getFullYear()} Cabelos Premium. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(toEmail: string, userName: string, token: string) {
  const url = `${BASE_URL}/verify-email?email=${encodeURIComponent(toEmail)}&token=${encodeURIComponent(token)}`;

  const body = `
    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#1a1611;margin:0 0 8px 0;">
      Confirme seu e-mail
    </h1>
    <div style="width:40px;height:2px;background:${brandColor};margin:0 0 24px 0;"></div>
    <p style="font-family:Helvetica,sans-serif;font-size:15px;color:#4a4540;line-height:1.6;margin:0 0 16px 0;">
      Olá, <strong>${userName}</strong>!
    </p>
    <p style="font-family:Helvetica,sans-serif;font-size:15px;color:#4a4540;line-height:1.6;margin:0 0 32px 0;">
      Bem-vindo à Cabelos Premium. Para ativar sua conta, confirme seu endereço de e-mail clicando no botão abaixo.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
      <tr>
        <td style="background:${brandColor};border-radius:6px;">
          <a href="${url}" style="display:inline-block;padding:14px 32px;font-family:Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
            Confirmar E-mail
          </a>
        </td>
      </tr>
    </table>
    <p style="font-family:Helvetica,sans-serif;font-size:13px;color:#9a9585;margin:0 0 8px 0;">
      O link expira em 24 horas. Caso não consiga clicar, copie e cole o endereço:
    </p>
    <p style="font-family:Helvetica,sans-serif;font-size:12px;color:${brandColor};word-break:break-all;margin:0;">
      ${url}
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "Confirme seu e-mail — Cabelos Premium",
    html: emailLayout("Confirme seu e-mail", body),
  });
}

export async function sendPasswordResetEmail(toEmail: string, userName: string, token: string) {
  const url = `${BASE_URL}/reset-password?email=${encodeURIComponent(toEmail)}&token=${encodeURIComponent(token)}`;

  const body = `
    <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#1a1611;margin:0 0 8px 0;">
      Redefinir senha
    </h1>
    <div style="width:40px;height:2px;background:${brandColor};margin:0 0 24px 0;"></div>
    <p style="font-family:Helvetica,sans-serif;font-size:15px;color:#4a4540;line-height:1.6;margin:0 0 16px 0;">
      Olá, <strong>${userName}</strong>!
    </p>
    <p style="font-family:Helvetica,sans-serif;font-size:15px;color:#4a4540;line-height:1.6;margin:0 0 32px 0;">
      Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
      Se não foi você, ignore este e-mail.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 32px 0;">
      <tr>
        <td style="background:${brandColor};border-radius:6px;">
          <a href="${url}" style="display:inline-block;padding:14px 32px;font-family:Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
            Redefinir Senha
          </a>
        </td>
      </tr>
    </table>
    <p style="font-family:Helvetica,sans-serif;font-size:13px;color:#9a9585;margin:0 0 8px 0;">
      Este link expira em 1 hora. Caso não consiga clicar, copie e cole:
    </p>
    <p style="font-family:Helvetica,sans-serif;font-size:12px;color:${brandColor};word-break:break-all;margin:0;">
      ${url}
    </p>
  `;

  await resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: "Redefinir senha — Cabelos Premium",
    html: emailLayout("Redefinir senha", body),
  });
}
