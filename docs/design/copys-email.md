# Ideas de copy — Email al invitado

Documento vivo de lluvia de ideas para los emails que le llegan al invitado,
en el mismo espíritu que [`copy-ideas.md`](copy-ideas.md): ideas sueltas sin
filtrar, la favorita del momento marcada con ⭐, nada se borra.

## Elementos a trabajar

Un email tiene tres lugares donde el invitado forma una primera impresión
antes de abrirlo — los tres se trabajan acá:

1. **Nombre del remitente** (lo que se ve en vez de la dirección de correo).
2. **Asunto** (subject).
3. **Texto de vista previa** (lo que Gmail y otros clientes muestran en gris
   justo debajo/al lado del asunto, antes de abrir el correo — también
   llamado "preheader").
4. **Cuerpo del email.**

## Cómo usar este documento

1. Cada elemento tiene su propia sección.
2. Tirar ideas sin pulir — cantidad antes que calidad.
3. Marcar con ⭐ la favorita actual de cada sección.
4. Anotar "Pendiente:" si hay un problema conocido (tono, largo, ambigüedad).
5. Cada idea lleva quién la propuso — **(Tomás)** o **(Claude)** — para poder
   rastrear de dónde vino cada dirección creativa.

## 1. Nombre del remitente

Hoy el email técnico de envío es siempre el mismo para todos los invitados;
lo que puede variar sin ningún problema de spam/autenticación es el nombre
visible que lo acompaña — es pura decoración de texto, no cambia quién
"firma" técnicamente el envío.

Preguntas abiertas: ¿el nombre es el del dueño de la lista ("Camila"), el de
la ocasión ("Cumpleaños de Camila"), o el de la marca del producto ("Lista
de Deseos")? ¿O una combinación?

- ⭐ "Lista de Deseos de [...]" (Tomás)
- "Lista de Camila" (Claude)
- "Camila (vía Lista de Deseos)" (Claude)
- "Lista de Deseos" (Claude)
  Pendiente: sin el nombre de la persona pierde calidez, se siente más
  corporativo.

## 2. Asunto

**Dirección (Tomás):** seguir la narrativa que ya tiene la app (la voz
juguetona del dueño de la lista hablándole al invitado — ver
`successThanksCopy` en el código) y hacer que el asunto le hable a la
persona sobre lo que **ella** acaba de lograr/cumplir. No es "guardamos tu
dato" (foco en el sistema) sino "mira lo que hiciste" (foco en el invitado)
— tiene que sentirse orgullosa/feliz de haberse encargado del regalo.

- "🗒 Anotado! Estás a cargo 🫰" (Tomás)
  Feedback (Tomás): habría que poner un poco de más de agradecimiento de
  todas maneras y más de satisfacción y no tanto de responsabilidad.
- ⭐ "En serio? Es que te pasas! 🌟" (Tomás)
- "Guardamos tu correo 💌" (Claude)
- "Ya quedó anotado, [Nombre]" (Claude)
- "Confirmado: tu regalo para [Ocasión]" (Claude)
  Pendiente: puede sonar como que ya se compró/pagó algo, cuando solo se
  guardó el email.

## 3. Texto de vista previa (preheader)

Sin definir todavía cómo se controla este texto en el proveedor de email
elegido — por ahora, solo ideas de contenido.

- ⭐ "Gracias por hacerte cargo 💚" (Tomás)
- "Así no se te pierde el dato de qué elegiste 🎁" (Claude)
- "Un mensaje corto, nada más." (Claude)

## 4. Cuerpo del email

Feedback (Tomás) sobre la primera versión implementada ("Guardamos tu correo
junto a [deseo], el deseo del que te encargaste."):

- "Hemos guardado tu correo y confirmado tu decisión de hacerte cargo del
  regalo. Recuerda que nuestra cita es el [fecha] y sólo quedan [tantos]
  días. Nos vemos, [remitente]" (Tomás)
  Nota: si la lista no tiene fecha de evento cargada, se omite la oración
  de la fecha/cuenta regresiva (decisión tomada 2026-07-23).
- ⭐ "Hemos guardado tu correo y te anotamos con el regalo [...]. Recuerda
  que nuestra cita es el [fecha] y sólo quedan [tantos] días. Nos vemos,
  [remitente]" (Tomás)
  Nota: [...] es el título del deseo reclamado (confirmado 2026-07-23).

## Propuesta final (para implementar)

Basada en las ⭐ de cada sección, con el ajuste de tono del último feedback
(más agradecimiento y satisfacción, menos responsabilidad):

- **Remitente:** "Lista de Deseos de [...]" (Tomás)
- **Asunto:** "En serio? Es que te pasas! 🌟" (Tomás)
- **Preheader:** "Gracias por hacerte cargo 💚" (Tomás)

Variante (Claude) — mismo texto, otros íconos, por si el 🌟 y el 💚 no
conviven bien entre sí o con el resto de la marca:

- **Asunto:** "En serio? Es que te pasas! 🥹"
- **Preheader:** "Gracias por hacerte cargo 🙏"

## Notas para cuando se implemente

- El approach técnico (cómo se parametriza cada elemento, de dónde sale el
  nombre del dueño, cómo se setea el preheader) va en un RFC aparte, no acá
  — esto es solo el contenido/tono.
