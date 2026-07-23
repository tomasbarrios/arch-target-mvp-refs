import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGuestEmailConfirmation({
  to,
  guestName,
  wishTitle,
}: {
  to: string;
  guestName: string;
  wishTitle: string;
}) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    console.error("EMAIL_FROM no está configurado, no se envía el email.");
    return;
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Confirmamos tu correo — Lista de Deseos",
    html: `<p>Hola ${guestName},</p><p>Guardamos tu correo junto a <b>${wishTitle}</b>, el deseo del que te encargaste.</p>`,
  });

  if (error) {
    console.error("Error al enviar email de confirmación:", error);
  }
}
