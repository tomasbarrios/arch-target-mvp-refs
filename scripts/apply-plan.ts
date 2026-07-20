/**
 * apply-plan.ts — Aplica un plan JSON generado por el bot de Telegram
 * (wishes-refinement) a la base Prisma, bajo demanda.
 *
 * Rama B (borrador + confirmación manual): el bot NO toca la DB. Este script
 * lo corre VOS sobre un archivo de output/ cuando decidís persistir.
 *
 * Comportamiento:
 *  - Lee el JSON de plan (forma: { noteId, message, plan: { wishes, excluded, needsReview } }).
 *  - Aplica solo los wishes que NO estan en needsReview (no se meten anomalias sin querer).
 *  - Los wishes con action="update" se traducen al formato de `updates` de import-wishes.ts
 *    (mergea links sin duplicar). Los de action="create" se crean.
 *  - flaggedAs (string) se convierte a string[] que espera el schema.
 *  - Informa cuantos se omitieron por needsReview y por que.
 *
 * Uso:
 *   npx ts-node scripts/apply-plan.ts <ruta/a/output/YYYYMMDD-HHMMSS_user.json>
 */

import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

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
  plan?: {
    noteId?: string;
    wishes?: PlanWish[];
    excluded?: unknown[];
    needsReview?: ReviewItem[];
  };
};

function toFlaggedArray(flaggedAs?: string): string[] | null {
  if (!flaggedAs || flaggedAs.trim() === "") return null;
  // Puede venir "important" o "ok2ndHand"; lo dejamos en un array de un elemento.
  return [flaggedAs.trim()];
}

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("Uso: npx ts-node scripts/apply-plan.ts <archivo-plan.json>");
    process.exit(1);
  }

  const raw: PlanFile = JSON.parse(readFileSync(path, "utf-8"));
  const plan = raw.plan ?? (raw as any); // tolera tanto {plan:{...}} como {...} plano
  const noteId = raw.noteId ?? plan.noteId;
  const wishes = plan.wishes ?? [];
  const needsReview = plan.needsReview ?? [];

  if (!noteId) {
    console.error("El plan no tiene noteId.");
    process.exit(1);
  }

  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) {
    console.error(`No existe la Note ${noteId}`);
    process.exit(1);
  }

  // Indices de wishes que caen en needsReview (se omiten al persistir).
  const reviewIndexes = new Set<number>();
  needsReview.forEach((r: ReviewItem) => {
    // El agente no numera los wishes; marcamos por coincidencia de titulo/url contra el review.
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
    [...reviewIndexes].sort((a, b) => a - b).forEach((i) => {
      const w = wishes[i];
      console.log(`   - omitido: ${w.title ?? "(sin titulo)"} — ver needsReview del plan`);
    });
  }

  // Separar updates vs creates
  const updates: { id: string; addExampleUrls: string[] }[] = [];
  const creates: {
    title: string;
    body: string;
    maxQuantity: number;
    flaggedAs: string[] | null;
    exampleUrls: string | null;
  }[] = [];

  for (const { w } of toApply) {
    if (w.action === "update" && w.wishId) {
      const urls = w.addExampleUrls ?? (w.exampleUrls ? w.exampleUrls.split("\n").filter(Boolean) : []);
      updates.push({ id: w.wishId, addExampleUrls: urls });
    } else {
      creates.push({
        title: w.title ?? "(sin titulo)",
        body: w.body ?? "",
        maxQuantity: w.maxQuantity ?? 1,
        flaggedAs: toFlaggedArray(w.flaggedAs),
        exampleUrls: w.exampleUrls ?? null,
      });
    }
  }

  // --- Aplicar updates (merge de links sin duplicar) ---
  for (const u of updates) {
    const existing = await prisma.wish.findUnique({ where: { id: u.id } });
    if (!existing) {
      console.error(`No existe el wish ${u.id}, se omite el update`);
      continue;
    }
    const existingUrls = existing.exampleUrls
      ? existing.exampleUrls.split("\n").filter(Boolean)
      : [];
    const mergedUrls = [...new Set([...existingUrls, ...u.addExampleUrls])];
    const wish = await prisma.wish.update({
      where: { id: u.id },
      data: { exampleUrls: mergedUrls.join("\n") },
    });
    console.log(`Actualizado: ${wish.title} (${wish.id}) con ${u.addExampleUrls.length} link(s)`);
  }

  // --- Aplicar creates ---
  const created = [];
  for (const c of creates) {
    const wish = await prisma.wish.create({
      data: {
        title: c.title,
        body: c.body,
        maxQuantity: c.maxQuantity,
        flaggedAs: c.flaggedAs && c.flaggedAs.length > 0 ? c.flaggedAs.join("\n") : null,
        exampleUrls: c.exampleUrls,
        noteId,
      },
    });
    created.push(wish);
    console.log(`Creado: ${wish.title} (${wish.id})`);
  }

  console.log(
    `\n✅ Aplicado a la nota "${note.title}": ${created.length} creados, ${updates.length} actualizados. ` +
      `${reviewIndexes.size} omitidos por needsReview.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
