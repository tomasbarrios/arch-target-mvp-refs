import type { Note, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wish } from "@prisma/client";

// export function getWish({
//   id,
//   noteId,
// }: Pick<Wish, "id"> & {
//   noteId?: Note["id"];
// }) {
//   return prisma.wish.findFirst({
//     select: { id: true, body: true, title: true, noteId: true },
//     where: { id },
//   });
// }

export function getWishListItems({ noteId }: { noteId: Note["id"] }) {
  return prisma.wish.findMany({
    where: { noteId },
    select: { id: true, title: true, noteId: true },
    orderBy: { updatedAt: "desc" },
  });
}
