# Meta — Framework de análisis y avance de un negocio

Este directorio es el **framework**, no el negocio. No contiene datos de ningún producto:
contiene las preguntas, los rituales, las guías y las plantillas para operar cualquier negocio.
El negocio concreto vive un nivel arriba (`business/`), construido usando estas plantillas.

## La idea central

Un negocio no es un plan: es un **conjunto de respuestas provisorias a preguntas eternas**
(¿quién es el cliente? ¿qué problema paga? ¿cómo me encuentra? ¿cuánto cobra?).
Las respuestas cambian con lo que aprendes; las preguntas no cambian nunca.

Por eso el framework no produce "un plan de negocio" que se escribe una vez.
Produce un **ciclo** que se ejecuta muchas veces:

```
   ┌────────────────────────────────────────────┐
   │  1. RESPONDER   las preguntas eternas       │
   │     (documentos vivos, con fecha)           │
   │  2. APOSTAR     elegir el supuesto más      │
   │     frágil y diseñar un experimento         │
   │  3. EJECUTAR    en el mundo real, timebox   │
   │  4. REVISAR     ritual semanal/mensual:     │
   │     ¿qué respuesta cambió?                  │
   └──────────────── repetir ───────────────────┘
```

## Mapa de esta carpeta

| Archivo | Qué es |
| --- | --- |
| [00-preguntas-eternas.md](00-preguntas-eternas.md) | Las 10 preguntas que se revisan por siempre. El corazón del framework. |
| [01-etapas.md](01-etapas.md) | Las etapas de un negocio, qué pregunta domina cada una y cuándo pasas a la siguiente. |
| [02-estructura.md](02-estructura.md) | Cómo se ve la carpeta de un negocio ordenado: qué documentos son vivos y qué se archiva. |
| `rituales/` | Los ciclos de revisión: [semanal](rituales/semanal.md) (30-45 min), [mensual](rituales/mensual.md) (~1.5 h), [trimestral](rituales/trimestral.md) (medio día). |
| `guias/` | Cómo hacer las cosas difíciles: [investigar el valor](guias/research-valor.md), [converger a una estrategia](guias/convergencia.md), [diseñar experimentos](guias/experimentos.md). |
| `plantillas/` | Un template por documento vivo del negocio. Cada uno declara qué preguntas responde. |

## Cómo empezar (día 1 con un negocio nuevo)

1. Lee [00-preguntas-eternas.md](00-preguntas-eternas.md) y respóndelas todas **en borrador,
   en una sentada, aunque sea con "no sé"**. Los "no sé" son el output valioso: son tu lista de riesgos.
2. Crea la carpeta del negocio según [02-estructura.md](02-estructura.md), copiando las plantillas.
3. Ubícate en una etapa con [01-etapas.md](01-etapas.md). Eso te dice qué pregunta domina ahora
   y qué documentos merecen esfuerzo (los demás quedan en borrador, está bien).
4. Diseña tu primer experimento ([plantillas/experimento.md](plantillas/experimento.md)) contra
   el supuesto más frágil.
5. Agenda el ritual semanal. Desde aquí, el framework se sostiene solo con los rituales.

## Cómo se usa en régimen

- **Semanal (30-45 min):** [rituales/semanal.md](rituales/semanal.md). Mirar el experimento activo,
  anotar aprendizajes, decidir la apuesta de la semana siguiente. No se reescriben documentos.
- **Mensual (~1.5 h, reemplaza al semanal de esa semana):** [rituales/mensual.md](rituales/mensual.md).
  Pasar por las preguntas eternas y actualizar los documentos vivos que quedaron obsoletos.
- **Trimestral (medio día):** [rituales/trimestral.md](rituales/trimestral.md). Pregunta de dirección:
  ¿seguir, ajustar o pivotar? Revisión de etapa.

## Reglas del framework

1. **Toda respuesta lleva fecha.** Una respuesta sin fecha no se puede desconfiar a tiempo.
2. **Documento vivo ≠ log.** Los vivos se sobrescriben (siempre dicen el presente);
   los logs (decisiones, experimentos, revisiones) solo se agregan, nunca se editan.
3. **Una apuesta a la vez.** Si hay dos experimentos "principales", no hay ninguno.
4. **El mercado responde, tú solo preguntas.** Ninguna respuesta pasa de "hipótesis" a "validada"
   sin evidencia externa (un pago, un uso repetido, una conducta observada — no una opinión).
5. **Escribir poco, revisar seguido.** Un documento de una página revisado 20 veces vale más
   que uno de veinte páginas revisado una vez.
