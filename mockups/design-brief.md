# Design Brief — "Hecho a mano"

Dirección ganadora de la ronda de exploración (2026-07-18). Referencia viva:
`mockups/01-direccion-c-hecho-a-mano.html` — copiar su CSS como base, no reinventar.

**Tono visual:** artesanal, cálido, cercano, chileno, lúdico contenido (nunca infantil).
**Audiencia:** invitado que llega desde WhatsApp al link de una lista de deseos; mobile 390px.

## Paleta

- Background: `#fffefb` — base
- Papel: `#faf6ec` — bloques destacados (mensaje del dueño)
- Kraft: `#d9c7a7` — placeholders de foto, cinta adhesiva `rgba(217,165,20,.45)`
- Tinta: `#33302c` — texto principal y botones primarios
- Rojo marcador: `#d64533` — acentos de urgencia/exacto, contador de días
- Verde: `#5a7d3b` — "algo como esto", timbres de tomado
- Mostaza: `#d9a514` — border-left del mensaje del dueño, detalles
- Gris cálido: `#8a8577` — texto secundario · Borde cards: `#e5decf`

## Tipografía

- UI y cuerpo: **Karla** 400/700/800, 15–16px base
- Manuscrita: **Caveat** 500/700 — notas de Maya, títulos de sección, contadores,
  timbres, firmas. Es la voz humana del sistema; la UI "de sistema" nunca la usa.

## Motivos del sistema

- Polaroid con cinta adhesiva para fotos; leve rotación (±0.5–3°) en cards y sellos
- Timbre inclinado con borde para lo tomado: **"lo tiene Caro B."** — siempre
  explícito quién, con nombre + apellido (o su inicial) para reconocerse entre
  conocidos. (Se descartó "madrinas/padrinos" — 2026-07-18.)
- Botones: rectangulares radius 4px, tinta sobre claro ("Yo me encargo")
- Nota personal del dueño en Caveat: es el alma de cada deseo
- Indicadores flexibilidad: `ESTE EXACTO ✓` (rojo) / `ALGO COMO ESTO` (verde)
- Precio: puntitos ●●○ (aprox), discretos en gris cálido
- Destacados: tabs simples "Todos / ★ Los que más le importan"

## Principios (ronda 2)

- **Incrementalidad emocional**: la intensidad del diseño sube a lo largo del
  journey; el pico es la confirmación (confeti a pantalla completa, celebración
  real). Ninguna pantalla posterior al pico compite con él.
- **Dos voces separadas por tipografía**: lo que dice el dueño va en Caveat y
  entre comillas; la app habla en Karla, segunda persona, cálida pero breve, y
  nunca dice "yo". Cada frase debe tener dueño evidente.
- **Primera impresión = la carta**: solo polaroid, fecha y mensaje del dueño con
  su solemnidad; los deseos viven detrás de un gesto ("Ver sus deseos").
- **Sin upsell**: nunca empujar "toma otro deseo"; mostrar el avance colectivo
  de la minga en su lugar.
- **Narrativa WhatsApp**: la ocasión al centro, la lista como confidencia — no
  promete invitación al evento ni centra la transacción.

## Lenguaje

Chileno, tuteo, habla una persona (nunca un sistema ni un "asistente del anfitrión").
Ver guardrails en `docs/handoff-creativo.md`.

## Restricciones

- HTML standalone, CSS embebido, sin dependencias salvo Google Fonts (Karla, Caveat)
- Solo viewport móvil 390px (frame `.phone` centrado como en la referencia)
- Contenido canónico: Cumpleaños de Maya, sáb 30 de agosto (faltan 43 días), 7 deseos
- No diseñar para problemas hipotéticos; soluciones simples y concretas

## Piezas del journey del invitado

1. `02-preview-whatsapp.html` — cómo se ve el link compartido en WhatsApp
2. `02-primera-impresion.html` — refinamiento de la dirección C (hecho aparte)
3. `02-explorar-deseos.html` — lista completa de 7 deseos
4. `02-tomar-deseo.html` — momento de conversión: pide solo el nombre
5. `02-confirmacion.html` — celebración + nudge opcional de email
6. `02-volver-mas-tarde.html` — el invitado vuelve, ve su compromiso
