# Recordar última lista usada al crear un deseo

## Problema

Cuando una usuaria crea un deseo, selecciona a qué lista asignarlo. Si crea un segundo deseo, el formulario vuelve a la lista por defecto. La usuaria tiene que volver a seleccionar la misma lista manualmente.

## Opciones consideradas

### 1. localStorage (frontend)

Al seleccionar una lista en el Combobox (o al crear un wish exitosamente), se persiste `lastNoteId` en `localStorage`. El loader de `/wishes/new` puede leerlo (vía `useFetcher` o pasándolo desde un script) y el Combobox inicia con ese valor.

**Pros**: Simple, no requiere cambios en el servidor.
**Contras**: No persiste entre navegadores/dispositivos ni si borran datos de navegación.

### 2. Query param (`/wishes/new?listaId=xxx`)

Los links para crear un deseo (ej. desde el botón en una lista vacía) incluyen `?listaId=xxx`. El loader lee el query param y lo usa como valor inicial.

**Pros**: Explícito, compartible, sin estado extra.
**Contras**: Solo funciona cuando se llega desde un link con el param; si la usuaria navega directo a `/wishes/new` no hay valor.

### 3. Cookie / sesión del servidor

Tras crear un wish, la action guarda el `noteId` usado en la sesión (flash cookie). El loader lo lee y pre-selecciona esa lista.

**Pros**: Persiste entre sesiones reales, funciona desde cualquier punto de entrada.
**Contras**: Más complejo, toca infraestructura de sesión, el dato es poco sensible como para justificar server-side.

## Decisión

**localStorage + query param**, con prioridad del query param.

1. Al seleccionar una lista en el Combobox, se escribe `lastWishListId` en `localStorage`.
2. Al cargar `/wishes/new`, primero se lee `?listaId=`; si no existe, se lee `localStorage`.
3. La cookie no se justifica: no es un dato sensible ni crítico, y localStorage es suficiente para mejorar la experiencia.

## Estado

Pendiente de implementar.
