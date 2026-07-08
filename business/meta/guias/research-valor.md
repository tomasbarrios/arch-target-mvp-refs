# Guía: investigar el valor

Cómo responder con evidencia (y no con entusiasmo) las preguntas eternas 1, 2 y 3:
quién es el cliente, qué problema le duele, y por qué te preferiría a su alternativa actual.
El output de todo este research alimenta `cliente.md` y `propuesta-valor.md`; el material
crudo va a `research/`.

## Principio: valor = alternativa actual − tu solución

Tu producto no tiene valor intrínseco. Su valor es la **diferencia** entre lo que al cliente
le cuesta su alternativa actual (tiempo, plata, errores, vergüenza) y lo que le cuesta la
tuya. Por eso el research de valor es, sobre todo, research de la alternativa actual:
si no sabes con detalle cómo resuelve el problema HOY, no sabes cuánto vales.

Corolario incómodo: la alternativa "no hacer nada" es la competencia más difícil. Si el
cliente vive tranquilo sin resolver el problema, no hay negocio por bueno que sea el producto.

## Jerarquía de evidencia

De más fuerte a más débil. Nunca uses evidencia de un nivel para reclamar el de arriba:

1. **Pagó** — plata real cambió de manos.
2. **Se comprometió con costo** — prepagó, firmó, invirtió horas en implementarte, te dio acceso a algo valioso.
3. **Conducta observada** — hoy gasta tiempo/plata en la alternativa (planillas, servicios, hacks). Observada, no relatada.
4. **Relato de conducta pasada** — "el mes pasado hice X para resolver esto" (verificable, específico).
5. **Opinión** — "me encanta", "yo lo usaría", "qué buena idea". **Vale cero.** Y de amigos, menos que cero.

## Las conversaciones (regla Mom Test)

La herramienta principal en etapas 0-2 son conversaciones de ~30 min con personas del perfil.
Reglas (de *The Mom Test*, Rob Fitzpatrick):

1. **Habla de su vida, no de tu idea.** Idealmente no menciones tu producto hasta el final, o nunca.
2. **Pasado y presente, nunca futuro.** "¿Qué hiciste la última vez que...?" sí;
   "¿usarías...?", "¿pagarías...?" no — la gente miente sobre el futuro sin querer.
3. **Pide detalles concretos:** cuándo fue la última vez, cuánto demoró, qué usó, a quién le preguntó, qué le costó.
4. **Busca el dolor con presupuesto:** ¿ya gastó algo (tiempo/plata) tratando de resolverlo? Ese es el signo vital.
5. **Los cumplidos son señal de fracaso** de la conversación: cambia de pregunta hacia hechos.

Guión mínimo (adaptar):
- "Cuéntame de la última vez que [situación del problema]."
- "¿Cómo lo resolviste? ¿Qué usaste? Muéstramelo si puedes."
- "¿Qué fue lo más tedioso/caro/estresante de eso?"
- "¿Intentaste algo más antes? ¿Por qué lo dejaste?"
- "¿Le pasa a más gente que conozcas?" (→ pipeline de próximas conversaciones)

Después de cada conversación: 10 min volcando notas a `research/` (textuales, sin interpretar).
Cada ~5 conversaciones: sesión de síntesis → actualizar `cliente.md` y `propuesta-valor.md`.

## Research de alternativas y competencia

- Lista las alternativas **que tus entrevistados realmente usan** (no las que Google dice que existen). Esa es la competencia real.
- Por cada una: qué hace bien (por eso la usan), dónde duele (tu apertura), qué cuesta.
- Competidores formales: sus precios te dan el rango de disposición a pagar del mercado; sus reviews negativas son research gratis de dolores.
- Que exista competencia es buena señal (hay mercado). "No hay nada parecido" suele significar "no hay problema que pagar".

## ¿Mercado suficiente?

En etapa temprana no necesitas un TAM de consultora; necesitas responder:
**¿existen suficientes personas-como-mis-clientes-reales, alcanzables por un canal que puedo operar?**
Aritmética de servilleta honesta (¿cuántos hay? ¿cuánto pagarían al año? ¿qué % es alcanzable?)
supera a cualquier informe. Se anota en `estrategia.md`.

## Anti-patrones

- **Encuestas antes de entrevistas.** Las encuestas cuantifican lo que ya entiendes; antes de ~10 conversaciones no entiendes nada aún.
- **Research infinito.** El research de valor tiene rendimientos decrecientes rápidos: tras 5-10 buenas conversaciones, la siguiente evidencia útil es intentar cobrar (etapa 2).
- **Buscar confirmación.** Si todas tus notas confirman tu idea, revisa tus preguntas: probablemente estás vendiendo, no investigando.
