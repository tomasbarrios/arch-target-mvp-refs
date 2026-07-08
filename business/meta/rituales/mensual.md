# Ritual mensual (~1.5 h)

Una vez al mes, **reemplaza** al ritual semanal de esa semana (no se suma). Donde el semanal
cierra ciclos de ejecución, el mensual actualiza el mapa: pasa por las 10 preguntas eternas
y deja los documentos vivos diciendo la verdad de hoy.

**Output:** `revisiones/AAAA-MM-DD-mensual.md` + documentos vivos actualizados con fecha nueva.

---

## Los 4 bloques

### 1. Releer el mes (20 min)
Lee las revisiones semanales del mes y los experimentos cerrados. Busca el patrón que no se
ve semana a semana:
- ¿Los aprendizajes apuntan en alguna dirección consistente?
- ¿Hay algo que evitaste 4 semanas seguidas? (eso suele ser lo importante)
- ¿La métrica norte se movió? ¿Sabes por qué (honestamente)?

### 2. Pasar por las 10 preguntas eternas (40 min)
Con [00-preguntas-eternas.md](../00-preguntas-eternas.md) abierto, pregunta por pregunta:
¿mi respuesta actual sigue siendo verdad?

- Si cambió → edita el documento vivo correspondiente ahora, no "después".
- Si sigue igual → actualiza igual la fecha de la cabecera (revisado ≠ sin revisar).
- Si sigue en [hipótesis] hace 2+ meses y es importante → candidata a supuesto más frágil.

Chequeo de estado: ¿alguna respuesta merece pasar de [hipótesis] a [validada]?
Solo con evidencia externa. Anota la evidencia en el documento.

### 3. Revisar la cartera de riesgos (15 min)
Lista los 3 supuestos más frágiles en orden. ¿El de arriba es el mismo del mes pasado?
- Si sí y no avanzó → el problema es de diseño de experimentos, lee [guias/experimentos.md](../guias/experimentos.md).
- Si cambió → verifica que sea por evidencia y no por aburrimiento (rotación de foco es la
  forma más elegante de no validar nada).

### 4. Plan del mes (15 min)
- La apuesta del mes en una frase ("este mes valido/consigo X").
- 2-4 experimentos u objetivos, cada uno con dueño de semana aproximada.
- Qué NO se hace este mes (tan importante como lo anterior — ver [guias/convergencia.md](../guias/convergencia.md)).

---

## Template

```markdown
# Revisión mensual — AAAA-MM-DD

## El mes en 3 líneas
...

## Preguntas eternas: qué cambió
| # | Pregunta | ¿Cambió? | Documento editado |
|---|----------|----------|-------------------|
| 1 | Cliente  | no       | — (fecha refrescada) |
| 7 | Pricing  | sí: ...  | pricing.md |

## Top 3 supuestos frágiles
1. ...
2. ...
3. ...

## Apuesta del mes
- Frase: ...
- Experimentos: ...
- NO haremos: ...

## Métrica norte
- Inicio de mes: X · Fin de mes: Y
```

---

## Señal de alarma

Si en el bloque 2 **ninguna** respuesta cambió en todo un mes, hay dos opciones y ambas son
graves: no estás tocando el mercado, o estás filtrando lo que el mercado te dice. El mensual
que no edita ningún documento vivo dos meses seguidos amerita adelantar el trimestral.
