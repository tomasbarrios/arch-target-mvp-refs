# RFC: Copys personalizables por lista

## Problema

Tres textos de la app están hardcodeados y el dueño de cada lista quiere
personalizarlos:

1. **Nombre que firma** el texto de intro en el home de la lista.
2. **Frase emotiva** justo antes de que la persona se asigne el regalo.
3. **Frase de agradecimiento** en la pantalla de éxito.

Hoy no hay dónde guardarlos sin tocar el código. Se busca un modelo de datos
limpio en Prisma y ubicarlo sin dispersar columnas mágicas.

## Alcance (acordado en la entrevista)

- Solo estos 3 textos, por ahora (YAGNI: no se modela una colección genérica
  de copys — si crecen, se refactorea a tabla hija o a `Json`).
- Por lista: cada `Note` tiene los suyos.
- Campo vacío → cae al string hardcodeado actual (no rompe listas existentes).
- Esta RFC es solo el modelo de datos. No incluye migración, código de lectura
  ni UI de edición.

## Propuesta: tres columnas opcionales en `Note`

El modelo ya existe (`prisma/schema.prisma`, línea 30). Se agregan tres
campos `String?` opcionales:

```prisma
model Note {
  id         String    @id @default(cuid())
  title      String
  body       String
  eventDate  DateTime?
  coverImage String?
  // --- copys personalizables por lista (opcionales; null => fallback hardcodeado) ---
  introSignerName   String?  // 1. quién firma el texto de intro en el home
  preAssignCopy     String?  // 2. frase emotiva antes de asignar el regalo
  successThanksCopy String?  // 3. frase de agradecimiento en pantalla de éxito
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  wish       Wish[]
}
```

### Por qué columns y no una tabla hija 1:1

- Son exactamente 3 campos, estables, siempre se leen junto con la `Note`.
- Una relación 1:1 (`NoteCopy`) agregaría un join por nada y más superficie de
  migración. Columnas en la misma tabla es lo más simple que resuelve el caso.
- Si algún día hay 10+ copys, el paso natural es moverlos a `Json` en un solo
  campo `copys Json?` o a una tabla hija — pero hoy eso sería especulación.

### Nombres de campos

Cortos y autoexplicativos, sin abreviaturas crípticas:

- `introSignerName` — el nombre/firma del dueño en el intro.
- `preAssignCopy` — copy previo a la asignación del regalo.
- `successThanksCopy` — copy de la pantalla de éxito.

## Comportamiento de lectura (para cuando se implemente)

En el frontend, cada texto se resuelve así:

```
textoMostrado = note.campo ?? HARDCODED_ACTUAL
```

El `??` (fallback) garantiza que listas existentes (con `null`) siguen
mostrando el texto de hoy sin migración de datos. Los tres `HARDCODED_ACTUAL`
son los strings que hoy están en el código; conviene centralizarlos en una
constante por si cambian, pero eso es detalle de implementación.

## Tradeoffs considerados

| Opción | Pros | Contras | Veredicto |
|--------|------|---------|-----------|
| 3 columnas `String?` en `Note` | simple, leídas con la Note, no rompe nada | si crecen mucho, columnas dispersas | **elegida** |
| Tabla hija 1:1 `NoteCopy` | aísla copys, escala a muchos | join innecesario para 3 campos | no por ahora |
| `Json` en `Note.copys` | flexible, un solo campo | pierde tipado por columna, más fricción de lectura | para cuando sean muchos |
| Campo global en `AppConfig` | una sola fuente | no es por lista (el requisito es por lista) | descartada |

## Fuera de alcance (esta RFC)

- Migración Prisma y corrida de `prisma migrate`.
- código que lee los campos y aplica el `??`.
- UI de edición en `/notes/:id/edit` (campos de texto para los 3).
- cualquier otro string de la app que no sea estos 3.

## Siguiente paso sugerido (cuando se apruebe)

1. `prisma migrate dev --name add_note_copys` con el diff de arriba.
2. Centralizar los 3 hardcoded actuales en constantes.
3. Aplicar `??` en los 3 lugares de render.
4. (Opcional, otra sesión) campos de edición en `/notes/:id/edit`.
