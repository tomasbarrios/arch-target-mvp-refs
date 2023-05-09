import type { Note, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wish } from "@prisma/client";

export function getWish({
  id,
  noteId,
}: Pick<Wish, "id"> & {
  noteId?: Note["id"];
}) {
  return prisma.wish.findFirst({
    select: { id: true, body: true, title: true, noteId: true },
    where: { id },
  });
}

export function getWishListItems({ noteId }: { noteId: Note["id"] | null }) {
  return prisma.wish.findMany({
    // where: { noteId },
    select: { id: true, title: true, noteId: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createWish({
  body,
  title,
  noteId,
}: Pick<Wish, "body" | "title"> & { noteId: Note["id"] }) {
    return prisma.wish.create({
      data: {
        title,
        body,
        noteId
      },
    });
}

export function deleteWish({
  id,
}: Pick<Wish, "id">) {
  return prisma.wish.deleteMany({
    where: { id },
  });
}
