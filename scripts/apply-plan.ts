/**
 * apply-plan.ts — Aplica un plan JSON del bot de Telegram a la base Prisma, bajo demanda.
 *
 * Rama B (borrador + confirmación manual): el bot NO toca la DB. Este script lo corrés VOS.
 *
 * Modos (flag --env):
 *   --env test : aplica contra la DB local (DATABASE_URL del .env). Firma appliedTest.
 *   --env prod : orquesta la carga en el container de Fly. Encapsula lo que antes se
 *                hacía a mano: (1) backup del volume, (2) compila ESTE mismo archivo a
 *                .mjs (el container no tiene ts-node), (3) lo sube, (4) lo corre con
 *                DATABASE_URL apuntando a /data/sqlite.db, (5) firma appliedProd.
 *
 * Nota de diseño: los wishes de CREATE no llevan wishId (Prisma genera cuid() distinto
 * en cada base), así que el JSON NO es portable entre test y prod. El bot genera un JSON
 * por ambiente (ver telegram_bot.py). Este script solo aplica el que le pasan.
 *
 * Uso:
 *   npx ts-node scripts/apply-plan.ts <ruta/plan.json> --env test
 *   npx ts-node scripts/apply-plan.ts <ruta/plan.prod.json> --env prod
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();

type PlanWish = {
  action?: "create" | "update";
  title?: string;
  body?: string;
  maxQuantity?: number;
  flaggedAs?: string;
  exampleUrls?: string;
  wishId?: string;
  addExampleUrls?: string[];
};

type ReviewItem = { type?: string; detail?: string; suggested?: string };

type PlanFile = {
  noteId?: string;
  appliedTest?: unknown;
  appliedProd?: unknown;
  plan?: {
    noteId?: string;
    wishes?: PlanWish[];
    excluded?: unknown[];
    needsReview?: ReviewItem[];
  };
};

function toFlaggedArray(flaggedAs?: string): string[] | null {
  if (!flaggedAs || flaggedAs.trim() === "") return null;
  return [flaggedAs.trim()];
}

type Summary = { created: number; updated: number; omitted: number; error?: string };

// Núcleo: aplica el plan a la DB a la que apunta `prisma` y devuelve el resumen real.
// Es env-agnóstico: no sabe si es test o prod; el llamador firma el estado según corresponda.
async function applyPlan(plan: NonNullable<PlanFile["plan"]>, noteId: string): Promise<Summary> {
  const wishes = plan.wishes ?? [];
  const needsReview = plan.needsReview ?? [];

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) {
    console.error(`No existe la Note ${noteId}`);
    process.exit(1);
  }

  // Indices de wishes que caen en needsReview (se omiten al persistir).
  const reviewIndexes = new Set<number>();
  needsReview.forEach((r: ReviewItem) => {
    const needle = (r.detail ?? "").toLowerCase();
    wishes.forEach((w: PlanWish, i: number) => {
      const hay = `${w.title ?? ""} ${w.exampleUrls ?? ""}`.toLowerCase();
      if (needle && hay.includes(needle.split("\n")[0]?.slice(0, 20) ?? "")) {
        reviewIndexes.add(i);
      }
    });
  });

  const toApply = wishes
    .map((w: PlanWish, i: number) => ({ w, i }))
    .filter((pair: { w: PlanWish; i: number }) => !reviewIndexes.has(pair.i));

  if (reviewIndexes.size > 0) {
    console.log(
      `⚠ Se OMITE(N) ${reviewIndexes.size} wish(es) marcado(s) en needsReview (no se persiste lo que requiere revision).`
    );
    Array.from(reviewIndexes).sort((a, b) => a - b).forEach((i) => {
      const w = wishes[i];
      console.log(`   - omitido: ${w.title ?? "(sin titulo)"} — ver needsReview del plan`);
    });
  }

  // --- Aplicar updates (merge de links sin duplicar) ---
  let updated = 0;
  for (const { w } of toApply) {
    if (w.action === "update" && w.wishId) {
      const existing = await prisma.wish.findUnique({ where: { id: w.wishId } });
      if (!existing) {
        console.error(`No existe el wish ${w.wishId}, se omite el update`);
        continue;
      }
      const existingUrls = existing.exampleUrls
        ? existing.exampleUrls.split("\n").filter(Boolean)
        : [];
      const urls = w.addExampleUrls ?? (w.exampleUrls ? w.exampleUrls.split("\n").filter(Boolean) : []);
      const mergedUrls = Array.from(new Set([...existingUrls, ...urls]));
      await prisma.wish.update({
        where: { id: w.wishId },
        data: { exampleUrls: mergedUrls.join("\n") },
      });
      updated++;
      console.log(`Actualizado: ${existing.title} (${existing.id}) con ${urls.length} link(s)`);
    }
  }

  // --- Aplicar creates ---
  const created = [];
  for (const { w } of toApply) {
    if (w.action === "update" && w.wishId) continue; // ya tratado arriba
    const wish = await prisma.wish.create({
      data: {
        title: w.title ?? "(sin titulo)",
        body: w.body ?? "",
        maxQuantity: w.maxQuantity ?? 1,
        flaggedAs: toFlaggedArray(w.flaggedAs) && toFlaggedArray(w.flaggedAs)!.length > 0
          ? toFlaggedArray(w.flaggedAs)!.join("\n")
          : null,
        exampleUrls: w.exampleUrls ?? null,
        noteId,
      },
    });
    created.push(wish);
    console.log(`Creado: ${wish.title} (${wish.id})`);
  }

  console.log(
    `\n✅ Aplicado a la nota "${note.title}": ${created.length} creados, ${updated} actualizados. ` +
      `${reviewIndexes.size} omitidos por needsReview.`
  );
  return { created: created.length, updated, omitted: reviewIndexes.size };
}

// Firma el estado en el JSON local (fuera de `plan`, para no romper la lectura del plan).
function signState(path: string, env: "test" | "prod", summary: Summary) {
  if (!existsSync(path)) {
    console.error(`No se puede firmar estado: no existe ${path}`);
    return;
  }
  const raw = JSON.parse(readFileSync(path, "utf-8")) as PlanFile;
  const stamp = new Date().toISOString();
  const ok = !summary.error;
  if (env === "test") raw.appliedTest = { at: stamp, ok, ...summary };
  else raw.appliedProd = { at: stamp, ok, ...summary };
  writeFileSync(path, JSON.stringify(raw, null, 2), "utf-8");
  console.log(`📝 Estado firmado: applied${env === "test" ? "Test" : "Prod"} (ok=${ok}) en ${path}`);
}

// --- Modo remoto: corre DENTRO del container de Fly. Solo aplica; no orquesta nada de Fly. ---
async function runRemote(path: string) {
  const raw: PlanFile = JSON.parse(readFileSync(path, "utf-8"));
  const plan = raw.plan ?? (raw as any);
  const noteId = raw.noteId ?? plan.noteId;
  if (!noteId) {
    console.error("El plan no tiene noteId.");
    process.exit(1);
  }
  const summary = await applyPlan(plan, noteId);
  // El orquestador local captura esta línea para firmar el estado.
  console.log("RESULT_JSON=" + JSON.stringify(summary));
}

// --- Orquestador local ---
async function main() {
  const args = process.argv.slice(2);
  const path = args.find((a) => !a.startsWith("--"));
  const envIdx = args.indexOf("--env");
  const env: "test" | "prod" = envIdx >= 0 ? (args[envIdx + 1] as any) : "test";
  const isRemote = args.includes("--remote");

  if (!path) {
    console.error("Uso: npx ts-node scripts/apply-plan.ts <archivo-plan.json> [--env test|prod]");
    process.exit(1);
  }

  if (isRemote) {
    await runRemote(path);
    return;
  }

  if (env === "test") {
    const raw: PlanFile = JSON.parse(readFileSync(path, "utf-8"));
    const plan = raw.plan ?? (raw as any);
    const noteId = raw.noteId ?? plan.noteId;
    if (!noteId) {
      console.error("El plan no tiene noteId.");
      process.exit(1);
    }
    const summary = await applyPlan(plan, noteId);
    signState(path, "test", summary);
    return;
  }

  if (env === "prod") {
    // (1) Backup fresco en el volume de Fly (sh -c porque --command no corre shell).
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const bak = `/data/sqlite.db.backup-${stamp}`;
    console.log(`📦 Backup prod: ${bak}`);
    execSync(`fly ssh console --command "sh -c 'cp /data/sqlite.db ${bak}'"`, { stdio: "pipe" });

    // (2) Compilar ESTE archivo a .mjs (el container no tiene ts-node). Se transpila con
    // el TypeScript local; @prisma/client queda como import externo (resuelto en /myapp).
    const ts = await import("typescript");
    const src = readFileSync(__filename, "utf-8");
    const out = ts.transpileModule(src, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const remoteFile = "/tmp/apply-plan.remote.mjs";
    writeFileSync(remoteFile, out);

    // (3) Subir script + JSON (sftp put no sobreescribe: borramos primero).
    execSync(`fly ssh console --command "sh -c 'rm -f /myapp/apply-plan.remote.mjs /myapp/plan-prod.json'"`, {
      stdio: "pipe",
    });
    execSync(`fly ssh sftp put ${remoteFile} /myapp/apply-plan.remote.mjs`, { stdio: "pipe" });
    execSync(`fly ssh sftp put ${path} /myapp/plan-prod.json`, { stdio: "pipe" });

    // (4) Ejecutar dentro del container apuntando a la DB de prod.
    const runCmd = `sh -c 'DATABASE_URL=file:/data/sqlite.db node /myapp/apply-plan.remote.mjs /myapp/plan-prod.json --env prod --remote'`;
    console.log("🚀 Ejecutando apply en prod...");
    const out2 = execSync(`fly ssh console --command ${JSON.stringify(runCmd)}`, {
      stdio: "pipe",
    }).toString();

    // (5) Capturar el resumen que imprimió el remoto.
    const m = out2.match(/RESULT_JSON=(\{.*\})/);
    const summary: Summary = m
      ? JSON.parse(m[1])
      : { created: 0, updated: 0, omitted: 0, error: out2 };

    // (6) Firmar estado en el JSON local.
    signState(path, "prod", summary);

    // (7) Limpiar artefactos del container.
    execSync(`fly ssh console --command "sh -c 'rm -f /myapp/apply-plan.remote.mjs /myapp/plan-prod.json'"`, {
      stdio: "pipe",
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
