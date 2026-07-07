# Rutas

| Ruta                            | Propósito                               | Acceso     | Navegación                                                          |
| ------------------------------- | --------------------------------------- | ---------- | ------------------------------------------------------------------- |
| `/`                             | Página principal / landing              | Público    | → `/join`, `/login` (no auth) · → `/listas` (auth)                  |
| `/login`                        | Inicio de sesión                        | Público    | → `/join`, `/newpassword` · Tras login → `/` o `/listas`            |
| `/join`                         | Registro de nueva usuaria               | Público    | → `/login` · Tras registro → `/`                                    |
| `/newpassword`                  | Restablecer contraseña                  | Público    | → `/login` · Tras cambio → `/`                                      |
| `/healthcheck`                  | Healthcheck de la DB                    | Público    | — (endpoint API)                                                    |
| `/mejoras`                      | Mejoras sugeridas y changelog           | Público    | — (página estática)                                                 |
| `/logout`                       | Cerrar sesión                           | Privado    | → `/`                                                               |
| `/me`                           | Perfil de usuaria (editar nombre)       | Privado    | → `/me` (self)                                                      |
| `/listas`                       | Listado de listas de deseos             | Privado    | → `/lista/:listaId`, `/me`, `/logout`                               |
| `/lista`                        | Layout principal de lista de deseos     | Privado    | → `/listas`, `/mejoras`, `/logout`                                  |
| `/lista/:listaId`               | Detalle de una lista de deseos          | Privado \* | → `/listas`, `/lista/:listaId/deseo/:wishId`, `/mejoras`, `/logout` |
| `/lista/:listaId/deseo/:wishId` | Detalle de un deseo dentro de una lista | Privado \* | → volunteer (self) · redirige a `/lista/:listaId`                   |
| `/wishes`                       | Layout de gestión de deseos             | Privado    | → `/wishes/new`, `/wishes/:wishId`, `/logout`                       |
| `/wishes/new`                   | Formulario para crear un deseo          | Privado    | → crea y redirige a `/wishes/:wishId`                               |
| `/wishes/:wishId`               | Detalle de un deseo                     | Privado    | → `/wishes/:wishId/edit`, borrar → `/wishes`                        |
| `/wishes/:wishId/edit`          | Editar un deseo                         | Privado    | → guarda y redirige a `/wishes/:wishId`                             |
| `/notes`                        | Layout e índice de notas                | Privado    | → `/notes/new`, `/notes/:noteId`, `/logout`                         |
| `/notes/new`                    | Crear una nueva nota                    | Privado    | → crea y redirige a `/notes/:noteId`                                |
| `/notes/:noteId`                | Detalle de una nota                     | Privado    | → `/notes/:noteId/edit`, borrar → `/notes`                          |
| `/notes/:noteId/edit`           | Editar una nota                         | Privado    | → guarda y redirige a `/notes/:noteId`                              |
| `/tasks`                        | Layout de gestión de tareas             | Privado    | → `/tasks/new`, `/tasks/:taskId`, `/logout`                         |
| `/tasks/new`                    | Crear una nueva tarea                   | Privado    | → crea y redirige a `/tasks/:taskId`                                |
| `/tasks/:taskId`                | Detalle de una tarea                    | Privado    | → borrar → `/tasks`                                                 |

\* `*` — Rutas alcanzables **también por link directo** (ej. alguien comparte `lista/:listaId` o `lista/:listaId/deseo/:wishId`). Requieren autenticación para ver el contenido, pero una usuaria con el link puede acceder si tiene sesión activa.
