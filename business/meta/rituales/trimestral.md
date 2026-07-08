# Ritual trimestral (medio día)

Cada ~3 meses (o antes, si un criterio de etapa se cumple o se rompe). Donde el semanal
ejecuta y el mensual actualiza el mapa, el trimestral pregunta si el mapa apunta al lugar
correcto: **¿seguir, ajustar o pivotar?**

Hazlo fuera del contexto habitual si puedes (otro lugar, sin pendientes abiertos). La pregunta
de dirección necesita distancia.

**Output:** `revisiones/AAAA-MM-DD-trimestral.md` + `estrategia.md` reescrito (o re-firmado) +
si hay pivote, la estrategia anterior copiada a `archivo/`.

---

## Los 5 bloques

### 1. Releer la historia completa (45 min)
- `decisiones.md` entero: ¿las decisiones envejecieron bien? ¿qué patrón hay en las malas?
- Los 3 mensuales del trimestre.
- La curva de la métrica norte en el trimestre.

### 2. Revisión de etapa (30 min)
Con [01-etapas.md](../01-etapas.md):
- ¿Cumples el criterio de salida de tu etapa actual? → avanza y anótalo en `estrategia.md`.
- ¿Dejaste de cumplir el de una etapa anterior? → retrocede sin drama; es información, no fracaso.
- ¿Llevas 2+ trimestres en la misma etapa? → pasa al bloque 3 con esa alerta encendida.

### 3. La pregunta de dirección (1 h)
Tres salidas posibles, y el trabajo es elegir una explícitamente:

- **Seguir** — la evidencia del trimestre es consistente con la apuesta. Ojo: "no hay
  evidencia en contra" porque no tocaste el mercado NO es evidencia a favor.
- **Ajustar** — la apuesta general vive, pero un componente falló con evidencia
  (el canal, el precio, el sub-segmento). Se cambia ese componente y se anota en `decisiones.md`.
- **Pivotar** — un supuesto estructural (cliente o problema, preguntas 1-2) resultó falso.
  Se archiva la estrategia, se reescribe, y el negocio vuelve a la etapa que corresponda
  (normalmente 0-1). Un pivote honesto y a tiempo es de las cosas más rentables que existen.

Prueba de honestidad: *si hoy no estuvieras dentro de este negocio, ¿entrarías, sabiendo lo
que sabes ahora?* Si la respuesta es no y eliges "seguir", escribe por qué.

### 4. Zoom out personal (15 min)
El negocio existe dentro de tu vida, no al revés:
- ¿El costo real del trimestre (horas, plata, ánimo) es sostenible otro trimestre igual?
- ¿Sigues queriendo que ESTE negocio funcione, o quieres que "un" negocio funcione?
  (Las dos son válidas; se ejecutan distinto.)

### 5. Reescribir o re-firmar la estrategia (30 min)
Termina con `estrategia.md` reflejando la dirección elegida, con fecha de hoy. Si no cambió
nada, se "re-firma": misma estrategia, fecha nueva, y una línea en `decisiones.md`
("trimestral AAAA-MM-DD: seguir, porque...").

---

## Template

```markdown
# Revisión trimestral — AAAA-MM-DD

## El trimestre en 5 líneas
...

## Etapa
- Etapa al inicio: N · Etapa hoy: N — [evidencia del criterio]

## Dirección: [SEGUIR | AJUSTAR | PIVOTAR]
- Evidencia principal: ...
- Qué cambia concretamente: ...
- Test de honestidad (¿entrarías hoy?): ...

## Sostenibilidad personal
...

## La apuesta del próximo trimestre (1 frase)
...
```
