# Deploy

## Convención vigente

**El push a `main` deploya solo.** No hay paso manual de `fly deploy` ni de tag de versión — es CI/CD continuo:

1. Push a `main` (o `dev`) dispara `.github/workflows/deploy.yml`.
2. Corre lint, typecheck, vitest y cypress. Si algo falla, no deploya.
3. Si todo pasa, construye la imagen Docker y la publica en `registry.fly.io`.
4. `main` → deploya a la app de producción (`arch-target-mvp-refs-8089`, ver `fly.toml`).
   `dev` → deploya a `<app>-staging`.

Por eso: **no hace falta correr `fly deploy` a mano** después de un merge/push a `main` — ya quedó desplegado por el pipeline. Correrlo manualmente solo tiene sentido para probar algo puntual sin pasar por CI (y hay que recordar que el próximo push igual va a redeployar por su cuenta).

## Secrets

Las variables de entorno de producción se manejan con `fly secrets set VAR=valor -a arch-target-mvp-refs-8089` — no viven en el repo. `.env.example` documenta cuáles existen, sin valores reales.
