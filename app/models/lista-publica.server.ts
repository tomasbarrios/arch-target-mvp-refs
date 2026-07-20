import type { Guest, Note, Wish } from "@prisma/client";

import { prisma } from "~/db.server";

function truncateEmail(email: string) {
  const [local] = email.split("@");
  return local;
}

export async function getListaPublica({
  listaId,
}: {
  listaId: Note["id"];
}) {
  const note = await prisma.note.findUnique({
    where: { id: listaId },
    select: {
      id: true,
      title: true,
      body: true,
      eventDate: true,
      coverImage: true,
      introSignerName: true,
      preAssignCopy: true,
      successThanksCopy: true,
      wish: {
        where: { hidden: false },
        select: {
          id: true,
          title: true,
          body: true,
          exampleUrls: true,
          linkImages: true,
          flexibility: true,
          priceTier: true,
          flaggedAs: true,
          guestVolunteer: {
            select: {
              guest: { select: { name: true } },
            },
          },
          volunteers: {
            select: {
              user: { select: { username: true, email: true } },
            },
            orderBy: { assignedAt: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!note) return null;

  const { wish, ...noteFields } = note;

  return {
    ...noteFields,
    wishes: wish.map(({ guestVolunteer, volunteers, ...wishFields }) => {
      const [firstVolunteer] = volunteers;
      const takenBy = guestVolunteer
        ? { name: guestVolunteer.guest.name }
        : firstVolunteer
        ? {
            name:
              firstVolunteer.user.username ??
              truncateEmail(firstVolunteer.user.email),
          }
        : null;

      return { ...wishFields, takenBy };
    }),
  };
}

export async function takeWish({
  wishId,
  guestId,
}: {
  wishId: Wish["id"];
  guestId: Guest["id"];
}) {
  return prisma.$transaction(async (tx) => {
    const existingGuestVolunteer = await tx.guestOnWish.findUnique({
      where: { wishId },
    });
    if (existingGuestVolunteer) {
      return { error: "Este deseo ya fue tomado." };
    }

    const existingUserVolunteer = await tx.usersOnWishVolunteers.findFirst({
      where: { wishId },
    });
    if (existingUserVolunteer) {
      return { error: "Este deseo ya fue tomado." };
    }

    const guestOnWish = await tx.guestOnWish.create({
      data: { wishId, guestId },
    });

    return { guestOnWish };
  });
}

export async function releaseWish({
  wishId,
  guestId,
}: {
  wishId: Wish["id"];
  guestId: Guest["id"];
}) {
  return prisma.guestOnWish.deleteMany({
    where: { wishId, guestId },
  });
}
