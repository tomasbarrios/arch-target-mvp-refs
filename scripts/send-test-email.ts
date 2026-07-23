import "dotenv/config";

import { Resend } from "resend";

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Uso: ts-node scripts/send-test-email.ts <email-destino>");
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error("Faltan RESEND_API_KEY y/o EMAIL_FROM en .env");
    process.exit(1);
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Prueba de envío — Lista de Deseos",
    html: "<p>Este es un email de prueba enviado desde el script <code>scripts/send-test-email.ts</code>.</p>",
  });

  if (error) {
    console.error("Error al enviar:", error);
    process.exit(1);
  }

  console.log(`Email enviado. id: ${data?.id}`);
}

main();
