import type { User, Task } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Task } from "@prisma/client";

export function getTask({
  id,
}: Pick<Task, "id">) {
  return prisma.task.findFirst({
    select: { id: true, body: true, title: true, userId: true },
    where: {
      id,
    },
  });
}

export function getTaskListItems({ userId }: { userId: User["id"] }) {
  return prisma.task.findMany({
    select: { id: true, title: true, userId: true },
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTask({
  body, title, userId
}: Pick<Task, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.task.create({
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

export function deleteTask({ id, userId }: Pick<Task, "id" | "userId">) {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
}
