# Diseño de página: Hoja de Ruta

## Problema

La página pública de feedback se llamaba "Mejoras" y la ruta era `/mejoras`. Confundía porque "sugerencias" se solapa con las sugerencias de regalos dentro de una lista.

Además, la página era funcional pero fría: listaba cosas hechas y cosas pendientes sin contar una historia.

## Decisiones

### Nombre

**Hoja de Ruta** (en lugar de "Mejoras" / "Sugerencias").

Razones:
- Es un concepto conocido en producto: pasado → presente → futuro.
- No se confunde con sugerencias de regalos.
- Comunica dirección, no solo un listado de cambios.

### Estructura narrativa (3 actos)

| Sección | Qué contiene | Propósito |
|---|---|---|
| ¿Qué dice la gente? | Patrones de feedback, quotes textuales, temas recurrentes | El lector se identifica: "no soy el único que pensó eso" |
| ¿Qué hemos hecho con eso? | Cambios implementados en respuesta al feedback | Genera confianza: "escuchan y actúan" |
| ¿Qué estamos explorando? | Lo que se está evaluando, prototipando o diseñando | Transparencia sin compromiso. Muestra dirección sin generar expectativas falsas |
| ¿Quieres sumarte? | CTA para enviar feedback + invitación a entrevistas | Cocreación, no solo queja |

### Tono

Conversacional, directo. Como si le hablaras a una persona. Ejemplo de título:

> *"Esto es lo que nos han contado — y lo que estamos haciendo al respecto"*

### Origen

Esta página nace de la necesidad de tener un feedback público estructurado que:
1. Valide a quienes ya dejaron sugerencias ("fuiste escuchado")
2. Eduque a quienes llegan ("esto es lo que hemos aprendido")
3. Invite a participar ("suma tu voz")

A su vez, el sistema de feedback interno (en `docs/feedback/`) alimenta esta página: las sesiones de feedback se consolidan y lo que es relevante públicamente se publica acá.
