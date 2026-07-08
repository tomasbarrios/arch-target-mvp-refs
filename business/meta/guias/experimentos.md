# Guía: diseñar y cerrar experimentos

El experimento es la unidad de avance del framework: la forma controlada de convertir
[hipótesis] en [validada] (o en descartada, que vale lo mismo). Esta guía es el criterio
de calidad; la plantilla está en [plantillas/experimento.md](../plantillas/experimento.md).

## Anatomía de un buen experimento

1. **Ataca el supuesto más frágil** (pregunta eterna 9). Un experimento sobre un supuesto
   cómodo es entretenimiento.
2. **Criterio de éxito numérico, escrito ANTES de ejecutar.** "De 10 contactados, 3 aceptan
   pagar" — no "ver cómo reacciona la gente". Sin criterio previo, cualquier resultado se
   puede narrar como éxito, y lo harás.
3. **Timebox.** Fecha de término escrita. Al vencer, el experimento se cierra con lo que
   haya: "no alcancé a ejecutarlo" también es un dato (sobre el diseño o sobre ti).
4. **Lo más barato que produzca la evidencia.** Antes de construir, pregunta: ¿puedo
   testear esto vendiendo a mano, con una landing, con una conversación, haciendo yo de
   producto (concierge)? La versión que no requiere código casi siempre existe.
5. **Resultado = conducta, no opinión.** El criterio de éxito se define en la jerarquía de
   evidencia de [research-valor.md](research-valor.md): pagos > compromisos costosos >
   conductas > relatos > opiniones.

## Tipos frecuentes por etapa

| Etapa | Experimento típico | Evidencia que produce |
| --- | --- | --- |
| 0-1 Problema | Tanda de 5 entrevistas Mom Test | ¿Existe el dolor con presupuesto? |
| 2 Venta | Concierge: hacer el servicio a mano y cobrar | ¿Alguien paga? ¿Por qué? |
| 2 Pricing | Ofrecer precio real a los siguientes N | ¿Dónde está el techo? |
| 3 Canal | Receta de canal ejecutada N veces igual | ¿El canal repite? ¿A qué costo? |
| 4 Crecimiento | 10× presupuesto/esfuerzo en canal probado | ¿Qué se rompe primero? |

## Cerrar un experimento (lo que casi nadie hace)

Un experimento no cerrado envenena el sistema: bloquea el slot de "una apuesta a la vez"
y deja el supuesto en limbo. Cerrar toma 10 minutos, en el archivo del experimento:

1. **Resultado contra el criterio:** cumplido / no cumplido / no ejecutado. Números reales.
2. **Veredicto sobre el supuesto:** validado / descartado / sigue abierto (y si sigue
   abierto, qué evidencia faltó — el próximo experimento se diseña para ESA evidencia).
3. **Propagación:** qué documento vivo cambia con esto. Editarlo ahora o anotarlo para el
   mensual. Un experimento que no cambia ningún documento no enseñó nada (¿por qué se hizo?).
4. Si generó una decisión → línea en `decisiones.md`.

## Anti-patrones

- **El experimento eterno:** sin timebox, "sigue corriendo" hace un mes. Ciérralo hoy con lo que haya.
- **Mover el arco:** ajustar el criterio de éxito después de ver los resultados. Si el
  criterio estaba mal, ciérralo como "criterio mal diseñado" y abre otro — pero no lo edites.
- **Experimento coartada:** diseñado para confirmar lo que ya decidiste hacer. Se reconoce
  porque ningún resultado posible te haría cambiar de plan. Test previo: "¿qué resultado me
  haría abandonar esta idea?" — si no existe, no es un experimento.
- **Construir para testear lo que se puede preguntar/vender.** Cada semana de construcción
  antes de la evidencia es riesgo comprado a precio lleno.
