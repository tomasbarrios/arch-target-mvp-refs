import type { Guest } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Guest } from "@prisma/client";

export function createGuest({ name }: Pick<Guest, "name">) {
  return prisma.guest.create({
    data: { name },
  });
}

export function getGuest(id: Guest["id"]) {
  return prisma.guest.findUnique({ where: { id } });
}

export function setGuestName({
  id,
  name,
}: Pick<Guest, "id" | "name">) {
  return prisma.guest.update({
    where: { id },
    data: { name },
  });
}

export function setGuestEmail({
  id,
  email,
}: Pick<Guest, "id" | "email">) {
  return prisma.guest.update({
    where: { id },
    data: { email },
  });
}
