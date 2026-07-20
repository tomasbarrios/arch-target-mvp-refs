READ ~/Projects/agent-scripts/AGENTS.MD BEFORE ANYTHING (skip if missing).

# Git

- No hagas commits si no se solicita explicitamente.
- Los commits solo deben ceñirse a lo que se hizo en la sesión
- Los commits JAMAS deben llevar Co-Authored-By ni ninguna mención a un agente/IA.

# Codestyle

- YAGNY (Kent Beck): No codear cosas que "quizas necesitaremos".
- Modifica estrictamente lo que se relaciona al prompt

## Estados del codigo:

Esto se basa en la filosofia de Kent Beck.

1. No existe. Then "Make it work"

Si no hay codigo previo con respecto a la feature, entonces nos concentraremos en que simplemente funcione.

- Tratamos de escribir poco codigo, no para ser breves sino para ser YAGNI.
- Claridad en la intención del lenguaje en el codigo
- No importa si repetimos (DRY no es necesario pero si deseable)
- Evita magias escondidas dificiles de leer
- El codigo no tiene que ser de la mejor calidad necesariamente
- Hace justo lo que se necesita, no hace mas (muy YAGNI)
- Si el codigo no es autoexplicativo con una mirada rápida al bloque, debemos comentarlo.

2. Ya existe y funciona. Pero podría mejorarse. Then "Make it right"

Si ya hay codigo previo, y queremos mejorar como funciona algo, se refiere a que el codigo:

- Sea idiomatico, refleje correctamente lo que hace
- Sea simple si se puede simplificar
- DRY deseable pero no impresindible. Preferir simplicidad
- Codigo mantenible, entendible por humanos
- Facil de testear
- Evita magias escondidas dificiles de leer

3. Make it fast

No todo el codigo debe ser rápido, pero si decidimos que una parte de nuestro software debe serlo. Debe realizarse esta optimizacion solo cuando las otras etapas ya se hicieron.

# Estilos de escritura

## Prefiere hablar de los porques de las cosas antes del como

SI: Recordar ultima seleccion
No: Combobox para seleccionar
