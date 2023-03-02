import type { Note, Task } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getTask({
  id,
  noteId,
}: Pick<Task, "id"> & {
  noteId: Note["id"];
}) {
  return prisma.task.findFirst({
    select: { id: true, body: true, title: true, noteId: true },
    where: { id },
  });
}

export function getTaskListItems({ noteId }: { noteId: Note["id"] | null }) {
  return prisma.task.findMany({
    // where: { noteId },
    select: { id: true, title: true, noteId: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTask({
  body,
  title,
  // noteId,
}: Pick<Task, "body" | "title">) {
    return prisma.task.create({
      data: {
        title,
        body,
      },
    });
}

export function deleteTask({
  id,
  noteId,
}: Pick<Task, "id"> & { noteId: Note["id"] }) {
  return prisma.task.deleteMany({
    where: { id, noteId },
  });
}
