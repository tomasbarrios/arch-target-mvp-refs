# Estructura de la carpeta de un negocio

Cómo se ve un negocio ordenado en disco. El principio organizador es la diferencia entre
**documentos vivos** (siempre dicen el presente, se sobrescriben) y **logs** (registran el
pasado, solo se agregan). Mezclarlos es la causa número uno del desorden: planes viejos que
parecen vigentes, y verdades vigentes enterradas en notas viejas.

```
business/
├── meta/                  # EL FRAMEWORK (este directorio). Agnóstico del producto.
│
│  ── DOCUMENTOS VIVOS ──  # el presente; se sobrescriben; cada uno nace de meta/plantillas/
├── estrategia.md          # el one-pager: apuesta actual, etapa, por qué ahora, por qué tú
├── cliente.md             # quién es el cliente y qué problema le duele
├── propuesta-valor.md     # qué usa hoy en vez de ti y por qué te preferiría
├── pricing.md             # cuánto paga, cómo, por qué ese número
├── canales.md             # cómo te encuentra; recetas de canal probadas
├── metricas.md            # la métrica norte y sus números actuales
│
│  ── LOGS (append-only) ──
├── decisiones.md          # una línea por decisión: fecha, qué, por qué, qué se descartó
├── experimentos/          # un archivo por experimento; se cierran con resultado, nunca se borran
│   ├── 2026-07-primera-venta.md
│   └── ...
├── revisiones/            # el output de cada ritual semanal/mensual/trimestral
│   ├── 2026-07-13-semanal.md
│   └── ...
│
│  ── APOYO ──
├── research/              # material crudo: notas de entrevistas, links, análisis de competencia
└── archivo/               # todo lo que dejó de ser verdad (ver política abajo)
```

## Qué documento responde qué pregunta

| Documento | Preguntas eternas que responde | Cuándo se actualiza |
| --- | --- | --- |
| `estrategia.md` | 4 (¿por qué ahora?), 5 (¿por qué tú?), 9 (supuesto más frágil) + resumen de todas | Mensual, o cuando cambia la apuesta |
| `cliente.md` | 1 (¿quién?), 2 (¿qué problema?) | Tras cada tanda de conversaciones con clientes |
| `propuesta-valor.md` | 3 (¿qué usa hoy y por qué tú?) | Cuando un cliente te da una razón real de compra/rechazo |
| `pricing.md` | 7 (¿cuánto y cómo paga?) | Tras cada venta o rechazo por precio |
| `canales.md` | 6 (¿cómo te encuentra?) | Cuando un canal se prueba (funcione o no) |
| `metricas.md` | 8 (¿qué número manda?) | Números: semanal. Definición de la métrica: trimestral |
| `decisiones.md` | 10 (registro de lo aprendido que cambió algo) | Cada vez que se decide algo no trivial |
| `experimentos/` | 9 en acción | Al abrir y al cerrar cada experimento |
| `revisiones/` | 10 (¿qué aprendí?) | Cada ritual |

## Convenciones

1. **Todo documento vivo empieza con la misma cabecera:**
   ```
   > Actualizado: AAAA-MM-DD · Estado: [hipótesis | parcialmente validada | validada]
   ```
   Un documento vivo con más de un ciclo mensual sin revisar se considera sospechoso.
2. **Nombres de logs llevan fecha al inicio:** `2026-07-13-semanal.md`, `2026-07-primera-venta.md`.
   Así ordenan solos y nunca se confunden con documentos vivos.
3. **Los documentos vivos son de una página.** Si crece más, el excedente es research
   (→ `research/`) o historia (→ `archivo/`).
4. **`decisiones.md` es una tabla, no un ensayo.** Fecha, decisión, por qué, alternativa
   descartada. Cuatro columnas. Su valor es releerlo en el trimestral.

## Política de archivo

Va a `archivo/` todo lo que **dejó de describir el presente pero explica cómo llegaste aquí**:

- Versiones anteriores de la estrategia cuando hay pivote (se copia el vivo a `archivo/` antes de reescribirlo).
- Planes con fecha vencida (planes de semana, de lanzamiento).
- Documentos de apuestas abandonadas.

No se archiva (se queda donde está): experimentos cerrados (viven en `experimentos/`, son log),
revisiones pasadas (`revisiones/`), decisiones (`decisiones.md`). Los logs ya son su propio archivo.

Nunca se borra nada: el costo de guardar es cero y el trimestral se alimenta de releer historia.

## Nacimiento de un negocio nuevo

```
cp -r meta/plantillas/* <negocio>/     # copiar plantillas como documentos vivos
mkdir <negocio>/{experimentos,revisiones,research,archivo}
touch <negocio>/decisiones.md
```

Luego seguir "Cómo empezar" en [README.md](README.md).
