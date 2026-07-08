# Las preguntas eternas

Estas preguntas no se responden una vez: se **re-responden por siempre**, porque el mercado,
el producto y tú cambian. El estado de un negocio es, literalmente, el estado de estas respuestas.

Cada pregunta indica:
- **Dónde vive la respuesta**: el documento vivo del negocio que la contiene.
- **Señales de respuesta débil**: cómo darte cuenta de que estás respondiendo con deseo y no con evidencia.

Regla de honestidad: cada respuesta se etiqueta como **[hipótesis]** o **[validada]**.
Solo pasa a validada con evidencia externa (pago, uso repetido, conducta observada).

---

## 1. ¿Quién es el cliente?

Una persona concreta que puedes nombrar, no un segmento. "Mujeres 25-40 interesadas en X" es
un segmento; "Carolina, que organiza el cumpleaños de su hija y odia recibir regalos repetidos"
es un cliente. El segmento se descubre *después*, generalizando desde clientes reales.

- **Vive en:** `cliente.md`
- **Respuesta débil si:** describes demografía en vez de una situación; no puedes nombrar a 3 personas reales que calcen; la descripción calza con "casi todo el mundo".

## 2. ¿Qué problema le duele lo suficiente como para pagar?

No qué problema *tiene* (tiene miles), sino cuál ya le duele tanto que hoy gasta tiempo,
plata o vergüenza en resolverlo mal.

- **Vive en:** `cliente.md` (el problema) y `propuesta-valor.md` (tu respuesta al problema)
- **Respuesta débil si:** el cliente dice "qué buena idea" pero no ha intentado resolverlo nunca; el dolor lo descubriste tú explicándoselo; la alternativa actual es "no hacer nada" y le acomoda.

## 3. ¿Qué usa hoy en vez de ti, y por qué te preferiría?

Tu competencia real casi nunca es otra empresa: es una planilla, un grupo de WhatsApp,
la memoria, o simplemente no hacer nada. Tienes que ser mejor que *eso*, no que el competidor famoso.

- **Vive en:** `propuesta-valor.md`
- **Respuesta débil si:** dices "no tengo competencia"; tu ventaja es una lista de features y no un resultado; la mejora es de 10% (nadie cambia de hábito por 10%).

## 4. ¿Por qué ahora?

Qué cambió en el mundo, en la tecnología o en la vida del cliente que hace que esto sea
posible/urgente hoy y no hace 5 años. Si nada cambió, pregúntate por qué no existe ya.

- **Vive en:** `estrategia.md`
- **Respuesta débil si:** la respuesta es "porque a mí se me ocurrió ahora".

## 5. ¿Por qué tú?

Tu ventaja injusta: acceso a clientes que otros no tienen, conocimiento del problema por
haberlo vivido, distribución existente, velocidad. Si no tienes ninguna, la estrategia debe
compensarlo (nicho más chico, canal más directo).

- **Vive en:** `estrategia.md`
- **Respuesta débil si:** tu ventaja es "ganas" o "ejecución" (todos dicen eso); tu ventaja la tiene cualquier programador/emprendedor.

## 6. ¿Cómo te encuentra el cliente?

El canal. Un producto sin canal es un hobby. La pregunta se responde con canales que ya
funcionaron al menos una vez, no con una lista de canales posibles.

- **Vive en:** `canales.md`
- **Respuesta débil si:** tu plan es "marketing en redes" sin haber conseguido un solo cliente por ahí; dependes de viralidad; el costo de conseguir un cliente es mayor que lo que te paga.

## 7. ¿Cuánto paga, cómo, y por qué ese número?

Pricing es una hipótesis como cualquier otra, y la única forma de validarla es cobrar.
Incluye el modelo (pago único, suscripción, comisión) y a quién se le cobra
(quien usa no siempre es quien paga).

- **Vive en:** `pricing.md`
- **Respuesta débil si:** el precio salió de dividir lo que necesitas ganar; nadie ha pagado ese número aún; le temes a decir el precio en voz alta.

## 8. ¿Qué número te dice si esto está funcionando?

Una métrica norte (no cinco). En etapas tempranas suele ser brutalmente simple:
clientes que pagaron, listas creadas por desconocidos, retención a la segunda semana.

- **Vive en:** `metricas.md`
- **Respuesta débil si:** miras métricas de vanidad (visitas, likes, registros sin uso); la métrica no la puede mover un experimento tuyo esta semana; no la sabes de memoria.

## 9. ¿Cuál es hoy el supuesto más frágil?

De todas las respuestas anteriores, ¿cuál, si resulta falsa, mata el negocio? Esa es la que
se ataca con el siguiente experimento. Trabajar en otra cosa es procrastinación con estilo.

- **Vive en:** `estrategia.md` (sección "apuesta actual") y el experimento activo
- **Respuesta débil si:** el experimento de la semana no ataca este supuesto; llevas un mes "validando" el mismo supuesto sin criterio de término.

## 10. ¿Qué aprendiste desde la última vez que cambia alguna respuesta anterior?

La pregunta que hace que las otras nueve sean eternas. Se hace en cada ritual. Si la
respuesta es "nada" muchas semanas seguidas, no estás tocando el mercado (estás construyendo).

- **Vive en:** `revisiones/` (log) y provoca ediciones en los documentos vivos
- **Respuesta débil si:** los aprendizajes son sobre el producto ("hice X feature") y no sobre el cliente/mercado.

---

## Cómo usarlas

- **Día 1:** responder las 10 en borrador, marcando todo como [hipótesis]. Los "no sé" van directo a la lista de riesgos.
- **Semanal:** solo la 9 y la 10 (¿supuesto más frágil? ¿qué aprendí?).
- **Mensual:** pasar por las 10 y actualizar los documentos vivos donde la respuesta cambió.
- **Trimestral:** las 10 más la pregunta de dirección (ver [rituales/trimestral.md](rituales/trimestral.md)).

La etapa del negocio ([01-etapas.md](01-etapas.md)) define cuál de estas preguntas **domina**:
en validación domina la 1-2-7; en crecimiento domina la 6-8. Las demás no desaparecen,
solo bajan de prioridad.
