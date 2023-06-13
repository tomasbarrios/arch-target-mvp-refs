import type { Note, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wish } from "@prisma/client";

export function getWishListItems({ noteId }: { noteId: Note["id"] }) {
  return prisma.wish.findMany({
    where: { noteId },
    select: { id: true, title: true, noteId: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getWishListItemsWithVolunteerCount({
  noteId,
}: {
  noteId: Note["id"] | null;
}) {
  return prisma.wish.findMany({
    where: { noteId },
    select: {
      id: true,
      title: true,
      noteId: true,
      _count: {
        select: {
          volunteers: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}
