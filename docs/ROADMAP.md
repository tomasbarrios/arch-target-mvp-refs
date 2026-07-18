# Roadmap

**Última revisión**: sin ejecutar aún — la primera vez que se corra el ritual semanal, anotar la fecha acá.

> Primera versión de este archivo. Las secciones marcadas **[borrador]** son una propuesta inicial armada a partir de `docs/feedback/`, `docs/happy-path.md` y `docs/playbook.md` — quien tenga el rol de producto debe confirmarlas o corregirlas en la próxima revisión, no asumirlas como decisión final.

## Estrategia

**[borrador]** Servimos a quien organiza un evento (cumpleaños, bautizo, matrimonio, etc.) y quiere coordinar regalos con sus invitados sin fricción. La apuesta actual: bajar la fricción para que un invitado se identifique y se asigne un deseo sin un registro clásico, y hacer que la lista se sienta personal y confiable en vez de un formulario frío.

## Hito actual

**[borrador] Método de identificación de invitado sin registro clásico**

Un invitado que recibe el link de una lista puede explorarla y asignarse un deseo sin la fricción de un registro completo (email + password). Es el hueco más grande del happy path hoy — ver opciones evaluadas en `docs/happy-path.md`.

**Decisión pendiente**: método de identificación — opciones B (magic link), C (código de verificación) o E (identifier-first) de `docs/happy-path.md`. Los slices de abajo asumen que ya se eligió uno; sin esta decisión el hito no puede empezar.

- [ ] Un invitado puede identificarse con el método elegido sin crear password
- [ ] Un invitado identificado puede asignarse un deseo (conectado al flujo existente)
- [ ] Si el invitado pierde el link/dispositivo, tiene alguna forma mínima de recuperar su asignación

## Próximos hitos (máx 2)

1. **[borrador] Sugerencias bidireccionales** — un invitado puede sugerir un regalo alternativo (con link/foto) y el dueño de la lista lo acepta o rechaza, con notificación al invitado. (Origen: `docs/feedback/2026-07-07-camila.md`, clúster "Sugerencias bidireccionales" — 3 ideas de 1 fuente, no 3 ocurrencias.)
2. **[borrador] Personalización de la lista** — foto destacada en la lista + galería de fotos colaborativa con moderación del dueño. (Origen: `docs/feedback/2026-07-07-camila.md`, clúster "Personalización" — 2 ideas de 1 fuente, no 2 ocurrencias.)

## Pool

*(cada ítem lleva su origen y la fecha en que entró al pool — sin fecha, la regla de purga "+2 meses sin subir de prioridad" del ritual semanal no se puede aplicar. Al mover un ítem del pool a "próximos hitos" o al reordenarlo con prioridad más alta, actualizar su fecha.)*

- Recordatorios automáticos antes del evento ("¿ya tienes el regalo de X?") — `docs/happy-path.md` (pool desde 2026-07-08)
- Cierre de asignaciones N días antes del evento + confirmación explícita del invitado — `docs/happy-path.md` (pool desde 2026-07-08)
- Tipos de evento como categoría de la lista (cumpleaños, bautizo, matrimonio, etc.) — `docs/feedback/2026-07-07-camila.md` (pool desde 2026-07-08)
- Versatilidad: extender el producto más allá de regalos (útiles, propuestas, repositorio comentable) — `docs/feedback/2026-07-07-camila.md` (pool desde 2026-07-08)
- Mensaje de agradecimiento al asignarse un deseo — `docs/feedback/2026-07-07-camila.md` (pool desde 2026-07-08)
- Limitar acceso a cumplir un deseo (solo ciertos invitados) — `docs/feedback/2026-07-08-anonimo-mejoras.md` (pool desde 2026-07-08)
- Mostrar nombre en vez de email del voluntario — `docs/feedback/2026-07-08-anonimo-mejoras.md` (pool desde 2026-07-08)
- Cantidad intuitiva (slider / % completado) — `docs/feedback/2026-07-07-pato-barrios.md` (pool desde 2026-07-08)
- Reputación / historial de cumplimiento por usuario — `docs/happy-path.md` (a futuro, baja prioridad; pool desde 2026-07-08)
- Pool de emergencia: regalos genéricos de respaldo agregados por el dueño — `docs/happy-path.md` (a futuro, baja prioridad; pool desde 2026-07-08)
- Modo sorpresa opcional por lista: ocultar asignaciones al dueño y revelarlas entre co-participantes de un regalo grupal para que se coordinen — `docs/handoff-creativo.md` (pool desde 2026-07-18)
- Aporte parcial / regalo grupal (vaquita): varios invitados se suman a un deseo caro — `docs/handoff-creativo.md`, relacionado con "Cantidad intuitiva" (pool desde 2026-07-18)

## Criterio de selección

Del pool sube lo que combine: (a) más ocurrencias en `docs/feedback/FEEDBACK.md`, (b) encaje con la estrategia vigente, (c) quepa en 1-2 semanas de trabajo. Empates los resuelve el rol de producto. Una idea sin encaje estratégico no sube por muchas ocurrencias que tenga — se anota como señal para revisar la estrategia.

## Definition of ready (pool → hito actual)

Antes de promover algo del pool, las tres preguntas deben responderse "sí". Si alguna es "no", la idea vuelve al pool con una nota de qué falta:

- ¿Puedo describir el resultado desde la perspectiva del usuario en 1 frase?
- ¿Sé cómo verificar que funciona (aunque sea manualmente)?
- ¿Cabe en 1-2 semanas? Si no, ¿cuál es el primer slice que sí?

## Ritual semanal

1. Leer feedback nuevo en `docs/feedback/` y actualizar `docs/feedback/FEEDBACK.md` (ocurrencias).
2. Mover candidatos al **pool** (no directo al hito). Purgar del pool lo que lleve más de 2 meses sin subir de prioridad.
3. Revisar el **hito actual**: marcar slices hechos. Si el hito se completó → registrar en `docs/features.md`, promover el próximo hito y sólo ahí definirle slices.
4. Releer la **estrategia** (30 segundos). Se reescribe solo si hubo un aprendizaje que la contradiga — no cada semana.
