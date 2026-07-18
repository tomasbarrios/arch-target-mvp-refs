# Handoff creativo: user journey desde cero

> Creado: 2026-07-18 · Para: equipo creativo (flujo + primeros mockups)
> Origen: entrevista de decisiones con Tomás (rol de producto).

Este documento define reglas de negocio y requerimientos mínimos. **No se ata a la UI
actual**: el equipo creativo diseña el flujo y los mockups desde cero. Lo que no está
fijado acá es libertad creativa.

## El producto en una frase

Una lista de deseos/regalos que alguien comparte por link para una ocasión (cumpleaños,
matrimonio, bautizo…), donde sus cercanos eligen qué regalar sin coordinar por WhatsApp.

## Norte de marca

> **No es un carrito de compras, es una minga.**

Una minga es la tradición chilena de colaboración colectiva: la comunidad se junta para
lograr algo que una persona sola no puede. Ese es el ánimo. Regalar acá es un gesto de
afecto y de comunidad, no una transacción. Sin necesidad de ser explícitos, el diseño
debe formar ese espíritu de colaboración y darle protagonismo a quienes regalan, tanto
como al dueño y su ocasión. La app desaparece; las personas son la estrella.

## Guardrails de tono

1. Español cercano, tuteo. Cálido, personal, confiable — nunca formulario frío ni
   estética de e-commerce/registro de tienda.
2. Protagonismo compartido: el dueño y su ocasión + el ánimo de colaboración de quienes
   regalan.
3. Cada vista lleva al menos un **mensaje de ejemplo** (abajo). No son finales: muestran
   el tipo de lenguaje. El equipo creativo propone mejores versiones sobre esa base.
   Ojo: varios de los ejemplos actuales están demasiado formales — suenan a "asistente
   del anfitrión". Chilenizar el lenguaje; que hable una persona, no un sistema.
4. **Descubrimiento progresivo**: las cosas se descubren una a la vez, nunca todo de
   golpe. Construir narrativas que generen preguntas y hagan interactuar. En cada
   momento, responder **la pregunta que la persona tiene en ese minuto** — que al
   llegar quizás no es "¿quién tomó qué?" sino "¿de qué se trata todo esto?".

Colores, tipografía, layout: libres.

## Personas y alcance

- **Invitado** (journey principal): recibe el link, explora, toma un deseo.
- **Dueño**: recibe su lista **ya armada** (se la arman como servicio), la revisa,
  edita, comparte y sigue su estado. No se diseña "crear lista desde cero" ni onboarding
  vacío.
- **Mobile-first**: ambos journeys se diseñan para teléfono. El invitado llega desde
  WhatsApp; desktop es adaptación secundaria.

## Reglas de negocio (MVP)

- **Explorar sin identificarse**: el invitado ve toda la lista, deseos y asignaciones
  sin registro alguno.
- **Identificación identifier-first**: recién al tomar un deseo se le pide **solo su
  nombre** (sin email, sin password; el dispositivo lo recuerda). Después de tomar, un
  nudge opcional: agregar email para no perder su asignación si cambia de dispositivo.
- **Todos ven todo**: dueño e invitados ven qué deseo está tomado y por quién. (La
  sorpresa se pierde a propósito: coordinar y evitar duplicados es el valor.)
- **Un deseo = un asignado.**
- **Estados**: solo Disponible ↔ Tomado. El invitado puede soltar un deseo que tomó; el
  dueño puede liberarlo.
- **Anatomía del deseo**: título (único obligatorio) + opcionales: nota personal, link
  de compra, foto, e indicador **"exacto vs. referencia"** ("quiero exactamente este" /
  "algo como esto, la marca no importa"). Este indicador cambia el mensaje al invitado.
- **Anatomía de la lista**: nombre, fecha del evento (visible — da urgencia: "faltan 12
  días"), foto de portada y mensaje de bienvenida del dueño.

## Método: tres capas por momento

Cada momento del journey se documenta (y se diseña) con tres capas:

1. **Emoción**: qué queremos provocar en la persona en ese momento (hipótesis — el
   equipo las refina).
2. **Preguntas**: qué se está preguntando el usuario ahí, priorizadas. Las más
   importantes deben responderse **visualmente, sin esfuerzo**.
3. **Mensaje de ejemplo**: un texto concreto que demuestra el tono.

## Journey del invitado

### 1. Recibe el link (WhatsApp)

- **Emoción**: curiosidad + afecto ("me invitaron a algo de alguien que quiero").
- **Preguntas**: ¿qué es esto? ¿de quién es? ¿qué gano con abrirlo?
- **Mensaje ejemplo** (preview del link / mensaje sugerido): "La lista de deseos de
  Camila 🎂 — mira qué le gustaría recibir para su cumple."

### 2. Abre la lista (primera impresión)

- **Emoción**: calidez y cercanía — llegó a un lugar personal, no a una tienda.
- **Preguntas** (priorizadas): ¿qué regalos hay? ¿para cuándo es el evento? ¿cuáles ya
  están tomados? ¿quién tomó qué?
- **Mensaje ejemplo** (bienvenida del dueño, en palabras de Tomás): "Hola, ¿cómo estás?
  Pronto voy a celebrar mi cumpleaños y eres uno de mis invitados especiales. Quise
  compartirte esos deseos que uno a veces no comenta por pudor, pero que harían que el
  regalo sea perfecto. Son solo ideas, por si te sirven — obvio que no es obligación:
  lo que más quiero es compartir contigo ese día."
- **Pregunta abierta para el equipo** (ver sección al final): dónde mostrar lo ya tomado
  sin abrumar este primer vistazo. Aplicar descubrimiento progresivo: la primera
  pregunta del recién llegado probablemente es "¿de qué se trata esto?", no "¿quién
  regaló qué?".

### 3. Explora los deseos

- **Emoción**: entusiasmo por encontrar "el regalo mío" — el que calza con la relación
  y el bolsillo.
- **Preguntas**: ¿qué es cada cosa? ¿dónde lo consigo? ¿quiere ese exacto o uno
  parecido? ¿está libre todavía? ¿cuáles son baratos y cuáles caros? ¿cuáles son
  difíciles de conseguir?
- **Mensaje ejemplo** (indicador de flexibilidad): "Quiero exactamente este" / "Algo
  como esto — la marca da lo mismo".
- **Indicador de flexibilidad**: suena serio pero en el fondo es chistoso — jugar con
  eso. Ideas: un termómetro, un velocímetro o algo similar que muestre cuánta
  flexibilidad hay y lo haga divertido.

### 4. Toma un deseo → dice su nombre

- **Emoción**: compromiso con orgullo, cero fricción. Que se sienta como levantar la
  mano en una minga, no como un checkout.
- **Preguntas**: ¿qué pasa si lo tomo? ¿me van a pedir registrarme? ¿puedo arrepentirme?
- **"¿Qué pasa si lo tomo?" es LA pregunta**: este es el momento de conversión y hay
  que estudiarlo a fondo. Hipótesis de freno (especulativa, a validar): la persona
  entiende o sospecha que tomar genera visibilidad pública de su gesto, y eso puede
  frenarla más que el registro.
- **Mensaje ejemplo**: "¡Buena elección! ¿Cómo te llamas, para que Camila sepa que tú
  te encargas de esto?" — está demasiado formal (habla el "asistente del anfitrión");
  chilenizar. Buscar algo emotivo y cercano sin ser cursi: como referencia de ánimo, un
  gif de Cecilia Bolocco ganando Miss Universo — "así de emocionados estamos con tu
  gesto". A futuro (quizás ahora): que el anfitrión personalice este mensaje y sume un
  sticker o meme; partir solo con la personalización del texto.

### 5. Deseo tomado (confirmación)

- **Emoción**: celebración + pertenencia ("ya soy parte de esto").
- **Preguntas**: ¿quedó registrado? ¿qué hago ahora? ¿cómo vuelvo después? Son las
  preguntas correctas: resolverlas todas, pero con descubrimiento progresivo — una idea
  a la vez, no presentar todo junto.
- **Mensaje ejemplo**: "Listo, [deseo] es tuyo 🙌 Camila ya puede contar contigo."
- **Nudge opcional (no bloqueante)**: "Si quieres, deja tu email para no perder tu
  elección si cambias de teléfono."

### 6. Vuelve más tarde

- **Emoción**: tranquilidad — su compromiso sigue ahí, sabe qué le toca.
- **Preguntas**: ¿qué tomé yo? ¿queda algo libre que quiera sumar? ¿puedo soltar lo mío?
- **Mensaje ejemplo**: "Tú te encargas de: [deseo]. Faltan 12 días 🎁"

## Journey del dueño

### 1. Abre su lista ya armada (primera impresión)

Momento clave del servicio: alguien le armó su lista. Debe sentirse como un regalo en sí
mismo.

- **Emoción**: sorpresa agradable + sentirse visto ("esto es muy yo").
- **Preguntas**: ¿qué pusieron por mí? ¿puedo cambiarlo? ¿esto lo ve alguien ya?
- **Mensaje ejemplo**: "Te armamos esta lista para tu cumple 🎂 Revísala, cambia lo que
  quieras y cuando esté lista, compártela."

### 2. Revisa y edita (agrega, edita, borra deseos)

- **Emoción**: control sin carga — retocar es fácil, no es "configurar".
- **Preguntas**: ¿cómo agrego algo? ¿puedo decir que quiero ese exacto? ¿cómo se verá
  para mis invitados?
- **Mensaje ejemplo** (campo nota): "Cuéntales por qué te gustaría — un detalle tuyo
  hace que elegir sea más fácil."

### 3. Comparte el link

- **Emoción**: ilusión — el momento de invitar a su gente.
- **Preguntas**: ¿qué van a ver ellos? ¿a quién se lo mando? ¿qué mensaje va con el
  link?
- **Mensaje ejemplo** (texto pre-armado para WhatsApp): "¡Hola! Armé una lista con
  ideas de regalo para mi cumple, por si te sirve: [link] 💛"
- **Diseñar el preview de WhatsApp**: cómo se ve el link compartido — foto, título y
  mensaje. Es de las partes más importantes de personalizar: un preview atractivo es
  gran parte de que el invitado abra.

### 4. Sigue el estado

- **Emoción**: gratitud y calma — ver a su gente movilizarse, saber que está cubierto.
- **Preguntas**: ¿qué está tomado y qué no? ¿quién tomó qué? ¿cuánto falta para el
  evento? ¿puedo liberar un deseo si alguien se bajó?
- **Mensaje ejemplo**: "3 de 8 deseos ya tienen quien se encargue 🙌"

## Preguntas abiertas para el equipo creativo

- **Lo ya tomado en la primera impresión**: hubo feedback de mostrar en la portada la
  lista de deseos ya tomados. Intuición de producto: puede ser demasiada estructura e
  información inicial. Decidir dónde y cuándo mostrar lo tomado sin abrumar el primer
  vistazo.
- **El momento de conversión (tomar un deseo)**: estudiarlo profundamente. ¿Qué frena
  ahí — el registro, o la visibilidad pública del gesto? (Ver journey del invitado §4.)
- Las **emociones por momento** son hipótesis: validarlas o proponer mejores.

## Futuro documentado (no diseñar, no bloquear)

El diseño no debe cerrarle la puerta a esto, pero tampoco diseñarlo ahora:

- **Modo sorpresa (opcional por lista)**: ocultar las asignaciones al dueño. En regalos
  de múltiples participantes, revelarlas *entre* los co-participantes para que se
  coordinen.
- **Aporte parcial / regalo grupal (vaquita)**: varios invitados se suman a un deseo
  caro. Es la dinámica que más encarna la minga.
- **Sugerencias bidireccionales**: un invitado propone un regalo alternativo y el dueño
  acepta o rechaza (próximo hito del `ROADMAP.md`, fuera de este handoff).
- **Compromiso reforzado**: estado "ya lo compré", recordatorios antes del evento,
  cierre de asignaciones, estado Cumplido post-evento.
