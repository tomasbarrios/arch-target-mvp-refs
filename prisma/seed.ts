import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
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
            assignedBy: 'Bob',
            assignedAt: new Date(),
            organization: {
              create: {
                name: "`${email}'s personal`",
                slug: email,
              },
            },
          }
        ],
      },
    },
  });

const note = await prisma.note.create({
  data: {
    title: "My first note",
    body: "Hello, world!",
    userId: user.id,
  },
});

await prisma.note.create({
  data: {
    title: "My second note",
    body: "Hello, world!",
    userId: user.id,
  },
});

//   /**
//    * Added by me
//    */

const tasks = [
  {
    title: "My First Post",
    body: `
    # This is my first task

    Isn't it great?
        `.trim(),
    noteId: note.id,
  },
  {
    title: "A Mixtape I Made Just For You",
    body: `
    # 90s Mixtape

    - I wish (Skee-Lo)
    - This Is How We Do It (Montell Jordan)
    - Everlong (Foo Fighters)
    - Ms. Jackson (Outkast)
    - Interstate Love Song (Stone Temple Pilots)
    - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
    - Just a Friend (Biz Markie)
    - The Man Who Sold The World (Nirvana)
    - Semi-Charmed Life (Third Eye Blind)
    - ...Baby One More Time (Britney Spears)
    - Better Man (Pearl Jam)
    - It's All Coming Back to Me Now (Céline Dion)
    - This Kiss (Faith Hill)
    - Fly Away (Lenny Kravits)
    - Scar Tissue (Red Hot Chili Peppers)
    - Santa Monica (Everclear)
    - C'mon N' Ride it (Quad City DJ's)
        `.trim(),
  },
];

for (const task of tasks) {
  // await prisma.task.upsert({
  //   where: { title: task.title },
  await prisma.task.create({
    data: task
  });
}

/**
 * Original again
 * 
 */
console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
