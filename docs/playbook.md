# Playbook — MVP Refs

## 2026-07-07

### Contexto inicial

Había cambios sin committear desde agosto 2023 (~3 años). Un WIP que intentaba agregar un Combobox para seleccionar qué lista asignar a un deseo nuevo, pero estaba incompleto: el Combobox era visual nomás, el `noteId` se mandaba hardcodeado.

### Decisiones tomadas

1. **Nueva rama**: `feat/select-note-combobox` para aislar los cambios viejos y trabajar sobre ellos.
2. **ROUTES.md**: Documentar rutas del proyecto con propósito, acceso y navegación.
3. **Fix filtro `wish: { some: {} }`**: En `getDefaultNotesForWish` — solo devolvía notas con al menos un deseo, ocultando las listas nuevas. Se eliminó el filtro.
4. **Fix `/listas`**: `getAllWishListsForUser` también filtraba por `latestKnownUrls` + `wish: { some: {} }`. Se cambió a `OR` para incluir notas propias (`userId`) además de las compartidas.
5. **Agregar deseo desde lista vacía**: Se agregó botón "+ Agregar deseo a esta lista" en `lista.$listaId.tsx` → `/wishes/new`.
6. **Combobox funcional**: Se limpió el componente (datos hardcodeados de frameworks eliminados, tipado, callback `onSelect`) y se conectó al estado del formulario para que el `noteId` enviado sea el seleccionado.
7. **Action usa `noteId` del form**: Antes la action ignoraba el `noteId` y asignaba a la primera lista encontrada. Ahora usa el del formulario si existe.
8. **Editar deseo permite cambiar lista**: Se agregó `noteId` a `updateWish`, Combobox al formulario de edición.

### Exploraciones

- **Recordar última lista usada al crear deseo** → [exploración](exploraciones/001-lista-preseleccionada.md)

### Estructura de documentación

Decidimos usar `docs/playbook.md` como diario de proceso, y `docs/exploraciones/` para profundizar decisiones que cumplan los [criterios](playbook-criteria.md).
