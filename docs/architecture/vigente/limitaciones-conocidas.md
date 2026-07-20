# Limitaciones conocidas

Registro append-only de comportamientos que son limitaciones de diseño conocidas
(no bugs pendientes de arreglar) — para no redescubrirlas cada vez y decidir a
propósito cuándo vale la pena levantarlas.

| Fecha | Limitación | Detalle |
|---|---|---|
| 2026-07-19 | Un invitado tiene una sola identidad (nombre) por dispositivo | Si toma varios deseos escribiendo nombres distintos, el nombre se actualiza globalmente — todos sus deseos tomados terminan mostrando el último nombre escrito. Es consecuencia de que la identidad vive en una cookie con un solo `guestId`, no uno por deseo. Cambiarlo requeriría otro modelo de datos (nombre por asignación, no por invitado). |
