import type { Note, User, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User, UsersOnWishVolunteers, Wish } from "@prisma/client";

export const flags = ["important", "ok2ndHand", "done"];

// property/content order varies by site, so both are matched
const OG_IMAGE_REGEXES = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
];

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    for (const regex of OG_IMAGE_REGEXES) {
      const match = html.match(regex);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchLinkImages(
  exampleUrls: string | null | undefined
): Promise<string | null> {
  if (!exampleUrls) return null;
  const urls = exampleUrls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const entries = await Promise.all(
    urls.map(async (url) => [url, await fetchOgImage(url)] as const)
  );
  const linkImages = Object.fromEntries(
    entries.filter(([, image]) => image !== null)
  );

  return Object.keys(linkImages).length > 0 ? JSON.stringify(linkImages) : null;
}

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
      hidden: true,
      linkImages: true,
    },
    where: { id },
  });
}

export function getWishListItems({ userId }: { userId: User["id"] }) {
  return prisma.wish.findMany({
    where: {
      note: {
        userId,
      },
    },
    select: { id: true, title: true, noteId: true, hidden: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createWish({
  body,
  title,
  exampleUrls,
  flaggedAs,
  noteId,
}: Pick<Wish, "body" | "title" | "exampleUrls" | "flaggedAs"> & {
  noteId: Note["id"];
}) {
  const linkImages = await fetchLinkImages(exampleUrls);
  return prisma.wish.create({
    data: {
      title,
      body,
      exampleUrls,
      flaggedAs,
      noteId,
      linkImages,
    },
  });
}

export function deleteWish({ id }: Pick<Wish, "id">) {
  // XXX this is very bad, un commenting this gets a bug
  // return prisma.wish.deleteMany({
  //   where: { id },
  // });
  /**
   * Currento BAD solutiuon: Disable delete
   *
   * Steps to reproduce:
   * 1. Go edit a wish
   * 2. change quantity
   * 3. save
   * 4. Open to again

Error:
Invalid `prisma.wish.deleteMany()` invocation in
/Users/tomas/own/remix/arch-target-mvp-refs/app/models/wish.server.ts:56:17

  53 }
  54
  55 export function deleteWish({ id }: Pick<Wish, "id">) {
→ 56   return prisma.wish.deleteMany(
Foreign key constraint failed on the field: `foreign key`
    at Pn.handleRequestError (/Users/tomas/own/remix/arch-target-mvp-refs/node_modules/@prisma/client/runtime/library.js:171:6929)
    at Pn.handleAndLogRequestError (/Users/tomas/own/remix/arch-tar

   */
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
      hidden: true,
      linkImages: true,
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
  quantity,
}: {
  wishId: string;
  userId: string;
  quantity: string;
}) {
  const numberQuantity = Number(quantity);
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

export async function updateWish({
  id,
  body,
  title,
  exampleUrls,
  flaggedAs,
  maxQuantity,
  noteId,
  hidden,
}: Pick<
  Wish,
  "id" | "body" | "title" | "exampleUrls" | "flaggedAs" | "maxQuantity" | "hidden"
> & { noteId?: string | null }) {
  const linkImages = await fetchLinkImages(exampleUrls);
  return prisma.wish.update({
    where: {
      id,
    },
    data: {
      title,
      body,
      exampleUrls,
      flaggedAs,
      maxQuantity,
      noteId,
      hidden,
      linkImages,
    },
  });
}
