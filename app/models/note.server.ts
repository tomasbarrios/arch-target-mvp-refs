import type { User, Note } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Note } from "@prisma/client";

export function getNote({
  id,
  userId,
}: Pick<Note, "id"> & {
  userId: User["id"];
}) {
  return prisma.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export function getNoteListItems({ userId }: { userId: User["id"] }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({
  body,
  title,
  userId,
}: Pick<Note, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}

/*
From here, added by me
*/

export function getWishListAsNote({
  id,
}: Pick<Note, "id">) {
  return prisma.note.findUniqueOrThrow({
    select: { id: true, title: true, body: true },
    where: { 
      id
    }
  });
}

export function getDefaultNoteForWish({
  userId,
}: Pick<Note, "userId">) {
  return prisma.note.findFirst({
    select: { id: true, title: true },
    where: { 
      userId, 
      wish: {
        some: { }
      }
    }
  });
}

export function createWishGroup({
  title = "Mi primera lista 💕",
  userId 
}: Pick<Note, "title"> & {
  userId: User["id"];
}) {
  return createNote({
    title, 
    body: "Mi primera lista de deseos para compartir",
    userId
  })
}

export function getAllWishLists() {
  return prisma.note.findMany({
    select: { id: true, title: true },
    where: { 
      wish: {
        some: { }
      }
    }
  });
}