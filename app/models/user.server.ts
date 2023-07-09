import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organizations: {
        create: [
          {
            assignedBy: "Bob",
            assignedAt: new Date(),
            organization: {
              create: {
                name: `${email}'s personal`,
                slug: email,
              },
            },
          },
        ],
      },
    },
  });
}

export function getUser({
  id,
}: Pick<User, "id"> & {
  userId: User["id"];
}) {
  return prisma.user.findFirst({
    select: { id: true, email: true },
    where: { id },
  });
}

export async function updateUser(email: User["email"], password: string) {
  console.log({ email, password });
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserInfo(id: User["id"], username: string) {
  console.log({ username });

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
    },
  });
}

export async function updateKnownUrls(id: User["id"], latestKnownUrls: string) {
  console.log({ latestKnownUrls });
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      latestKnownUrls,
    },
  });
}

export function getUserListItems({ userId }: { userId: User["id"] }) {
  return prisma.user.findMany({
    where: { id: userId },
    select: { id: true, email: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
