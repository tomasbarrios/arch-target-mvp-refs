# Probar el envío de emails

Dos formas de probar el email de confirmación al invitado
(`app/services/email.server.ts`), según qué se está cambiando.

## Cuándo usar cuál

| Cambia... | Usar |
|---|---|
| Texto, formato, íconos, subject, preheader | **Script directo** |
| Qué datos se pasan o de dónde salen (wishTitle, eventDate, dueño) | **Flujo completo** |
| La ruta/acción que dispara el envío | **Flujo completo** |

## Prerequisitos

- `.env` local con `RESEND_API_KEY` y `EMAIL_FROM` (ver `.env.example`).
- El dominio de test de Resend (`onboarding@resend.dev`, el que se usa en
  local) **solo puede enviar al email de la cuenta de Resend**, no a
  cualquier destinatario — para probar en local, mandar siempre a ese email
  de cuenta.
- En producción `EMAIL_FROM` ya usa el dominio propio verificado
  (`notificaciones@listadedeseos.cl`), así que ahí sí se puede enviar a
  cualquier destinatario real.

## Script directo (rápido, sin tocar la DB)

Crear un script temporal (o reusar uno existente) que llame a la función de
envío con datos hardcodeados, sin pasar por ninguna ruta ni crear registros:

```ts
// scripts/test-email-copy.ts (temporal, no commitear si es solo para iterar)
import "dotenv/config";
import { sendGuestEmailConfirmation } from "~/services/email.server";

sendGuestEmailConfirmation({
  to: "tu-email-de-cuenta-resend@ejemplo.com",
  guestName: "Test",
  wishTitle: "Deseo de prueba",
  dueño: "Prueba",
  eventDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // o null
});
```

```bash
npx ts-node --require tsconfig-paths/register scripts/test-email-copy.ts
```

Revisar la bandeja de entrada del destinatario. No queda nada que limpiar.

## Flujo completo (prueba la ruta real)

Simula lo que hace un invitado de verdad: reclama un deseo y guarda su
email, contra una **Note/Wish descartables** (nunca contra listas reales).

### 1. Crear datos de prueba

Local, contra `prisma/data.db`:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const user = await prisma.user.findFirst();
  const eventDate = new Date(Date.now() + 12*24*60*60*1000); // opcional
  const note = await prisma.note.create({ data: { title: 'Cumpleaños de Prueba', body: 'nota de prueba', userId: user.id, eventDate } });
  const wish = await prisma.wish.create({ data: { title: 'Deseo de prueba TEST', body: '', noteId: note.id } });
  console.log(note.id, wish.id);
  await prisma.\$disconnect();
})();
"
```

En producción, igual pero vía `fly ssh console -a arch-target-mvp-refs-8089 -C "node -e \"...\""` (mismo script, corre contra el volumen `/data` real).

### 2. Levantar el server (solo local)

```bash
npm run dev
```

Anotar el puerto real que imprime (`Remix App Server started at http://localhost:XXXX` — no siempre es 3000).

### 3. Reclamar el deseo y guardar el email

Con un cookie jar para mantener la sesión de invitado entre requests:

```bash
JAR=/tmp/cookies.txt
URL="http://localhost:XXXX/lista/<noteId>/deseo/<wishId>"   # o https://arch-target-mvp-refs-8089.fly.dev/... en prod

curl -s -c $JAR -b $JAR -X POST "$URL" \
  --data-urlencode "intent=take" --data-urlencode "name=Test" \
  -o /dev/null -w "take: %{http_code}\n"

curl -s -c $JAR -b $JAR -X POST "$URL" \
  --data-urlencode "intent=email" --data-urlencode "email=<tu-email-de-cuenta-resend>" \
  -w "\nemail: %{http_code}\n"
```

Un `emailSaved":true` en la respuesta confirma que el guardado funcionó; el
envío en sí no falla la respuesta si Resend da error (queda solo logueado).

### 4. Revisar errores

- Local: `grep -i error` sobre el log de `npm run dev`.
- Producción: `fly logs -a arch-target-mvp-refs-8089 --no-tail`.

`sendGuestEmailConfirmation` solo loguea si Resend devuelve error — sin
líneas de error es buena señal, pero la confirmación real es que el correo
llegue a la bandeja.

### 5. Limpiar

Siempre borrar la Note/Wish de prueba al terminar (local o prod, mismo
patrón que crearla):

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  await prisma.guestOnWish.deleteMany({ where: { wishId: '<wishId>' } });
  await prisma.wish.delete({ where: { id: '<wishId>' } });
  await prisma.note.delete({ where: { id: '<noteId>' } });
  await prisma.\$disconnect();
})();
"
```
