import type { Note, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Wish, User, UsersOnWishVolunteers } from "@prisma/client";

export const flags = ["important", "ok2ndHand", "done"];

export function getWish({
  id,
  noteId,
}: Pick<Wish, "id"> & {
  noteId?: Note["id"];
}) {
  return prisma.wish.findFirst({
    select: {
      id: true,
      body: true,
      title: true,
      exampleUrls: true,
      flaggedAs: true,
      noteId: true,
      maxQuantity: true,
    },
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
  exampleUrls,
  flaggedAs,
  noteId,
}: Pick<Wish, "body" | "title" | "exampleUrls" | "flaggedAs"> & { noteId: Note["id"] }) {
  return prisma.wish.create({
    data: {
      title,
      body,
      exampleUrls,
      flaggedAs,
      noteId,
    },
  });
}

export function deleteWish({ id }: Pick<Wish, "id">) {
  return prisma.wish.deleteMany({
    where: { id },
  });
}

export function getWishWithNote({
  id,
  noteId,
}: Pick<Wish, "id"> & {
  noteId?: Note["id"];
}) {
  return prisma.wish.findUnique({
    select: {
      id: true,
      body: true,
      title: true,
      exampleUrls: true,
      noteId: true,
    },
    where: { id },
    // include: {
    //   note: true,
    // }
  });
}

/**
 * "Volunteers" methods
 */

/**
 * Returns a record if the wish has one or more volunteers
 * @param param0
 * @returns
 */
export function getWishAlreadyVolunteered({ wishId }: { wishId: string }) {
  return prisma.wish.findFirst({
    where: {
      id: wishId,
      volunteers: {
        some: {},
      },
    },
    include: {
      volunteers: {
        include: {
          user: true, // only to get the username (prob we should )
          /**
           * TODO: Catch usernames (?)
           */

        },
        orderBy: {
          assignedAt: "asc",
        },
      },
    },
  });
}

/**
 * Returns true if user is registered as volunteer for wish
 * @param param0
 * @returns
 */
export async function isUserVolunteer({
  wishId,
  userId,
}: {
  wishId: string;
  userId: string;
}) {
  const wish = await getWishAlreadyVolunteered({ wishId });
  if (!wish) {
    return false;
  }
  console.log("getWishByVolunteer", {
    userId,
    volunteerId: wish.volunteers.map((v) => v.userId),
  });
  const isUserVolunteer = wish.volunteers.some((v) => v.userId === userId);
  return isUserVolunteer;
}


export function assignVolunteer({
  wishId,
  userId,
  quantity
}: {
  wishId: string;
  userId: string;
  quantity: string;
}) {
  const numberQuantity = Number(quantity)
  return prisma.usersOnWishVolunteers.upsert({
    where: { wishId_userId: { wishId, userId } },
    create: {
      userId,
      wishId,
      assignedBy: userId,
      quantity: numberQuantity,
    },
    update: {
      assignedBy: userId,
      quantity: numberQuantity,
    },
  });
}

export function updateWish({
  id,
  body,
  title,
  exampleUrls,
  flaggedAs,
  maxQuantity,
}: Pick<Wish, "id" | "body" | "title" | "exampleUrls" | "flaggedAs" | "maxQuantity">) {
  return prisma.wish.update({
    where: {
      id,
    },
    data: {
      title,
      body,
      exampleUrls,
      flaggedAs,
      maxQuantity
    },
  });
}
