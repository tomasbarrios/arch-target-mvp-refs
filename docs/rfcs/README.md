# RFCs — propuestas técnicas

Propuestas de **approach técnico** elaboradas: contexto, opciones, tradeoffs y decisión. Pueden existir sin estar en el ROADMAP.

## Qué es y qué no es

| Tipo | Dónde |
|------|--------|
| Approach por capacidad (o transversal de impacto) | **Esta carpeta** |
| Mapa / forma del sistema (etapas transversales) | [`../architecture/exploration/`](../architecture/exploration/) |
| Patrón ya usado en el codebase | [`../architecture/vigente/`](../architecture/vigente/) |
| Lock-in o estándar de proyecto | [`../ADRs/`](../ADRs/) |
| Convención operativa recurrente | [`../devs/`](../devs/) |
| UX conceptual (sin implementación) | [`../design/`](../design/) |
| Idea cruda sin elaborar | [`../exploration/`](../exploration/) |
| Hechos del mundo externo | [`../domain/`](../domain/) |

**Regla:** la carpeta la decide el *tipo de documento*, no el *alcance del impacto*.

## Estados

| Estado | Significado |
|--------|-------------|
| `borrador` | Se discute; puede cambiar |
| `aceptado` | Approach elegido; aún no (o no del todo) en código |
| `implementado` | Vive en el codebase; el RFC queda como historial |
| `supersedido` | Otro RFC o ADR lo reemplazó |

Al pasar a `implementado`: documentar el patrón en `architecture/vigente/` si es durable; ADR solo si hay lock-in; **no borrar** el RFC.

## Naming

- Kebab-case: `persistencia-sesion.md`
- Sin número de release en el nombre
- Sin prefijo `rfc-001-` obligatorio
- El estado va en el encabezado del doc

## Pareja con `design/`

Si hay capa UX y capa técnica: `design/` = qué ve/decide el usuario; `rfcs/` = cómo se modela/persiste. Cada uno enlaza al otro en el encabezado.

## Plantilla de encabezado

```markdown
# Título — RFC

> **Estado:** `borrador` | `aceptado` | `implementado` | `supersedido`
>
> Contraparte de dominio (si aplica): [`../domain/….md`](../domain/….md)
> Contraparte UX (si aplica): [`../design/….md`](../design/….md)
```

## Índice

| RFC | Estado | Notas |
|-----|--------|-------|
| *(añadir filas aquí)* | | |
