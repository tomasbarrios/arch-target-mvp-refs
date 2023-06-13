import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Organization } from "@prisma/client";

export function getOrganization({ userId }: { userId?: User["id"] }) {
  return prisma.organization.findMany({
    where: {
      users: {
        some: {
          user: {
            id: {
              equals: userId,
            },
          },
        },
      },
    },
  });
}
