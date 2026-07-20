# Dominio

Hechos y reglas del **mundo externo** (negocio, proveedor, regulación, catálogo real).

## Reglas

1. Documentar **cómo funciona ahí fuera**, no cómo lo cotiza/implementa nuestra app.
2. **Sin** menciones de alcance MVP, ROADMAP, ni “en el carrito / Map / componente”.
3. Si hace falta el approach de producto, enlazar un RFC: `../rfcs/….md`.

## Ejemplo de frontera

| Va en domain | Va en RFC |
|--------------|-----------|
| Precio de la oferta = suma de ítems pagados | La oferta entra al carrito como un solo SKU |
| Los regalos no suman PV | Los regalos se muestran en una capa UI que no suma |
| Calendario / stock / SKUs del proveedor | Default de modo de cotización en nuestra app |
