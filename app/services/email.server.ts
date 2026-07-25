import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
  }).format(date);
}

function diasRestantes(date: Date) {
  const ms = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export async function sendGuestEmailConfirmation({
  to,
  guestName,
  wishTitle,
  dueño,
  eventDate,
  restoreUrl,
}: {
  to: string;
  guestName: string;
  wishTitle: string;
  dueño: string | null;
  eventDate: Date | null;
  restoreUrl: string;
}) {
  const address = process.env.EMAIL_FROM;
  if (!address) {
    console.error("EMAIL_FROM no está configurado, no se envía el email.");
    return;
  }

  const senderName = dueño
    ? `Lista de Deseos de ${dueño}`
    : "Lista de Deseos";
  const from = `${senderName} <${address}>`;

  const preheader = "Gracias por hacerte cargo 💚";
  const safeGuestName = escapeHtml(guestName);
  const safeWishTitle = escapeHtml(wishTitle);

  const citaParrafo = eventDate
    ? `<p>Recuerda que nuestra cita es el ${formatFecha(
        eventDate
      )} y sólo quedan ${diasRestantes(eventDate)} días.</p>`
    : "";

  const html = `
    <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
    <p>Hola ${safeGuestName},</p>
    <p>Hemos guardado tu correo y te anotamos con el regalo <b>${safeWishTitle}</b>.</p>
    ${citaParrafo}
    <p>Nos vemos, ${escapeHtml(senderName)}</p>
    <p style="font-size:12px;color:#888;margin-top:16px;">
      ¿Cambiaste de opinión? <a href="${restoreUrl}">Volver a tu deseo</a>.
    </p>
  `;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "En serio? Es que te pasas! 🌟",
    html,
  });

  if (error) {
    console.error("Error al enviar email de confirmación:", error);
  }
}
