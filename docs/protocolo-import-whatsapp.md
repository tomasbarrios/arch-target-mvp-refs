# Protocolo: de mensajes de WhatsApp a wishes en una lista

Guía de cómo Claude procesa ideas de regalo que llegan por WhatsApp y las convierte en `Wish`es dentro de una `Note` (lista) existente.

## 1. Qué se pega y cómo

- El origen siempre es texto de WhatsApp copiado/pegado (no capturas de pantalla).
- Las ideas llegan **ya filtradas**: quien pega el texto solo incluye los mensajes relevantes, sin saludos ni charla de por medio.
- Si hay varias ideas en un mismo pegado, **la persona las separa explícitamente** (una por bloque/línea). Claude no intenta adivinar los límites entre ideas dentro de un párrafo ambiguo.
- Junto con el texto, la persona indica el **`noteId`** de la lista destino (no se infiere del contenido).

## 2. Hints de estilo por lista

Antes de parsear, Claude lee `scripts/list-hints.json`, que mapea `noteId → { name, styleHints }`. Estos hints describen la "onda" de esa lista (colores, materiales, qué evitar, etc.) y se usan para:

- Redactar mejor el `body` de cada wish.
- Detectar conflictos que vale la pena chequear con la persona (ej. un link de un personaje con licencia cuando el hint dice "sin personajes").

Si la lista todavía no tiene entrada en ese archivo, se le pregunta a la persona los hints y se agrega una entrada nueva antes de seguir. Está pensado para que a futuro el dueño de la lista provea esta info directamente.

## 3. Parseo de cada idea

Para cada link/idea del mensaje:

- **`title`**: corto, generado a partir del contenido (nombre del producto, sin ruido de tracking del link).
- **`body`**: entre 3 y 10 palabras aprox., describe brevemente el producto (talla, material, para qué sirve, etc.).
- **`maxQuantity`**: se infiere del texto si dice algo explícito (ej. "necesito 2"); si no, `1`.
- **`flaggedAs`** (`important` / `ok2ndHand`): se infiere solo si el texto lo sugiere explícitamente (ej. "muy importante", "acepto de segunda mano"). Si no hay señal, queda vacío.
- **`exampleUrls`**: el/los link(s) del mensaje, uno por línea.

## 4. Anomalías y decisiones que SIEMPRE se consultan

Antes de armar la tabla final, Claude revisa el lote buscando casos que no debe resolver solo:

- **Contenido fuera de lugar** (ej. un link que no es un regalo, como una propiedad en venta) → se pregunta si excluir.
- **Conflicto con los style hints** de la lista (ej. personajes con licencia en una lista que pide evitarlos) → se pregunta si incluir o no.
- **Links sin producto concreto** (ej. perfil de Instagram de una marca sin ítem específico) → se pregunta cómo tratarlo (excluir vs. wish genérico).
- **Duplicados**, en dos sentidos:
  - Entre sí, dentro del mismo lote (ej. dos variantes de un mismo tipo de producto).
  - Contra wishes que ya existen en la Note.

### Regla para duplicados exactos

Cuando varios links son variantes del mismo objeto (ej. dos regaderas, dos pares de calcetines), **no se crean wishes separados**: se agrupan en un solo wish con varios links en `exampleUrls` (uno por línea). Si ese objeto ya tiene un wish existente en la lista, se **actualiza ese wish** agregándole los links nuevos en vez de crear uno nuevo.

Si los productos son evidentemente distintos entre sí (estilos, materiales o propósitos distintos) aunque compartan categoría (ej. dos tipos de lápices bien diferentes), se separan en wishes independientes — esto se decide caso a caso con la persona, no automáticamente.

### Wishes ocultos (`hidden: true`)

Si aparece un link que podría sumarse a un wish existente pero ese wish está oculto (`hidden`), no se asume qué hacer — se pregunta explícitamente si: ignorar el link, agregarlo igual al wish oculto, o crear un wish nuevo y visible.

## 5. Revisión antes de escribir en la base

Claude arma una **tabla markdown** con el resultado final:

- Wishes existentes a actualizar (y qué links se les agregan).
- Wishes nuevos a crear (title, body, cantidad de links).
- Ítems excluidos y por qué.

Nada se escribe en la base hasta que la persona confirma o corrige la tabla.

## 6. Ejecución técnica

1. Claude escribe un archivo JSON temporal en el scratchpad (no versionado) con la forma:
   ```json
   {
     "noteId": "...",
     "updates": [{ "id": "wishId", "addExampleUrls": ["url1", "url2"] }],
     "wishes": [{ "title": "...", "body": "...", "exampleUrls": "url1\nurl2" }]
   }
   ```
2. Se corre contra la base local (`prisma/data.db`) con:
   ```bash
   npx ts-node scripts/import-wishes.ts <archivo.json>
   ```
3. El script (`scripts/import-wishes.ts`, versionado en el repo):
   - Para cada `update`, mergea los links nuevos con los existentes de ese wish (sin duplicar) vía `prisma.wish.update`.
   - Para cada wish nuevo, hace `prisma.wish.create` directo.

**Importante:** este script llama a Prisma directamente, **no** pasa por `createWish`/`updateWish` de `app/models/wish.server.ts`. Esto significa que el import **no** dispara la búsqueda automática de imagen de los links (ver siguiente sección) — los wishes importados por script quedan sin `linkImages` hasta que alguien los edite manualmente desde la app.

## 7. Feature relacionada: imagen automática de cada link

Cuando un wish se crea o edita **desde la UI de la app** (no desde el script de import), `createWish`/`updateWish` llaman a `fetchLinkImages`, que intenta sacar la imagen `og:image` de cada URL en `exampleUrls` (timeout 5s, best-effort: si un link falla o el sitio no expone `og:image`, ese link simplemente queda sin imagen, no rompe el guardado). El resultado se guarda en `Wish.linkImages` (JSON `url → imageUrl`) y se muestra como miniatura junto al link en:

- El detalle privado del wish (`/wishes/:id`).
- La vista pública del deseo (`/lista/:listaId/deseo/:wishId`).

Limitaciones conocidas:
- **Mercado Libre** bloquea el scraping con una verificación anti-bot — sus links casi nunca traen imagen.
- Algunos sitios (ej. Casaideas) no exponen `og:image` en el HTML servido (posiblemente lo cargan por JS).
- Tiendas más simples (Shopify, ej. Monarch, María Pompón) suelen funcionar bien.

## 8. Imagen de portada de la lista (`Note.coverImage`)

No tiene relación directa con el import de wishes, pero es parte del mismo flujo de "vestir" una lista: se configura en `/notes/:noteId/edit`, campo "Imagen de portada (link)". Se usa como foto principal en la vista pública de la lista y como `og:image` al compartir el link.

## 9. Checklist rápido para la próxima tanda

1. ¿Tengo el `noteId` destino?
2. ¿Existe entrada en `scripts/list-hints.json` para esa lista? Si no, pedirla.
3. Parsear ideas → generar title/body/maxQuantity/flaggedAs/exampleUrls.
4. Revisar contra wishes existentes de la Note (duplicados, hidden).
5. Marcar anomalías (fuera de tema, conflicto de estilo, links sin producto concreto) y preguntar.
6. Mostrar tabla de revisión y esperar confirmación.
7. Generar JSON en el scratchpad y correr `scripts/import-wishes.ts`.
8. Avisar que los wishes importados no van a tener imagen automática hasta que se editen desde la app.
