import { readFileSync } from "fs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ImportWish = {
  title: string;
  body: string;
  maxQuantity?: number;
  flaggedAs?: string[];
  exampleUrls?: string;
};

type UpdateWish = {
  id: string;
  addExampleUrls: string[];
};

type ImportFile = {
  noteId: string;
  wishes: ImportWish[];
  updates?: UpdateWish[];
};

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("Uso: ts-node scripts/import-wishes.ts <archivo.json>");
    process.exit(1);
  }

  const input: ImportFile = JSON.parse(readFileSync(path, "utf-8"));

  const note = await prisma.note.findUnique({ where: { id: input.noteId } });
  if (!note) {
    console.error(`No existe la Note ${input.noteId}`);
    process.exit(1);
  }

  for (const u of input.updates ?? []) {
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

  const created = [];
  for (const w of input.wishes) {
    const wish = await prisma.wish.create({
      data: {
        title: w.title,
        body: w.body,
        maxQuantity: w.maxQuantity ?? 1,
        flaggedAs: w.flaggedAs && w.flaggedAs.length > 0 ? w.flaggedAs.join("\n") : null,
        exampleUrls: w.exampleUrls ?? null,
        noteId: input.noteId,
      },
    });
    created.push(wish);
    console.log(`Creado: ${wish.title} (${wish.id})`);
  }

  console.log(`\n${created.length} wishes creados en la nota "${note.title}".`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
