import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "tomas@remix.run";

  // cleanup the existing database
  await prisma.user
    .update({
      data: {
        organizations: {
          deleteMany: {},
        },
      },
      where: { email },
    })
    .catch(() => {
      // no worries if errors
      console.log("ATTEMPTING TO UPDATE CURRENT USER", email);
      console.log("COULD NOT DELETE EXISTING RELATION!!");
    });

  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
    console.log("COULD NOT DELETE!!");
  });

  const hashedPassword = await bcrypt.hash("wishiscool", 10);

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

  // const tasks = [
  //   {
  //     title: "My First Post",
  //     body: `
  //   # This is my first task

  //   Isn't it great?
  //       `.trim(),
  //     noteId: note.id,
  //   },
  //   {
  //     title: "A Mixtape I Made Just For You",
  //     body: `
  //   # 90s Mixtape

  //   - I wish (Skee-Lo)
  //   - This Is How We Do It (Montell Jordan)
  //   - Everlong (Foo Fighters)
  //   - Ms. Jackson (Outkast)
  //   - Interstate Love Song (Stone Temple Pilots)
  //   - Killing Me Softly With His Song (Fugees, Ms. Lauryn Hill)
  //   - Just a Friend (Biz Markie)
  //   - The Man Who Sold The World (Nirvana)
  //   - Semi-Charmed Life (Third Eye Blind)
  //   - ...Baby One More Time (Britney Spears)
  //   - Better Man (Pearl Jam)
  //   - It's All Coming Back to Me Now (Céline Dion)
  //   - This Kiss (Faith Hill)
  //   - Fly Away (Lenny Kravits)
  //   - Scar Tissue (Red Hot Chili Peppers)
  //   - Santa Monica (Everclear)
  //   - C'mon N' Ride it (Quad City DJ's)
  //       `.trim(),
  //   },
  // ];

  // for (const task of tasks) {
  // await prisma.task.upsert({
  //   where: { title: task.title },
  // await prisma.task.create({
  //   data: task,
  // });
  // }

  const wishes = [
    {
      title: "Pilucho recién nacido",
      body: `
    # Solo algodon porfa
        `.trim(),
      noteId: note.id,
    },
  ];

  for (const wish of wishes) {
    // await prisma.wish.upsert({
    //   where: { title: wish.title },
    await prisma.wish.create({
      data: wish,
    });
  }

  /**
   * Original again
   *
   */

  /**
   * Lista canónica de desarrollo: el cumple de Maya
   */
  await prisma.note.deleteMany({ where: { title: "Cumpleaños de Maya" } });

  const mayaNote = await prisma.note.create({
    data: {
      title: "Cumpleaños de Maya",
      eventDate: new Date("2026-08-30"),
      body: `Hola, ¿cómo estás? Pronto voy a celebrar mi cumpleaños y eres uno de mis invitados especiales. Quise compartirte esos deseos que uno a veces no comenta por pudor, pero que harían que el regalo sea perfecto. Son solo ideas, por si te sirven — obvio que no es obligación: lo que más quiero es compartir contigo ese día.`,
      userId: user.id,
    },
  });

  const mayaWishes = [
    {
      title: "Entradas para Los Bunkers",
      body: '"¡Van a tocar en septiembre y me muero por ir!"',
      flexibility: "exact",
      priceTier: 2,
    },
    {
      title: "La casa de los espíritus, ed. ilustrada",
      body: '"La tengo re vieja y ya se me cae a pedazos"',
      flexibility: "exact",
      priceTier: 1,
    },
    {
      title: "Tetera enlozada",
      body: '"Para el té de las cinco, algo bonito y de esas que duran"',
      flexibility: "similar",
      priceTier: 1,
    },
    {
      title: "Una planta para el balcón",
      body: '"Cualquiera menos cactus, porfa 🌵"',
      flexibility: "similar",
      priceTier: 1,
    },
    {
      title: "Audífonos bluetooth",
      body: '"Los míos ya no cargan ni a rogarles"',
      flexibility: "similar",
      priceTier: 3,
    },
    {
      title: "Un buen vermut",
      body: '"Para la sobremesa del mismo cumple"',
      flexibility: "similar",
      priceTier: 1,
    },
    {
      title: "Clase de cerámica",
      body: '"Siempre quise aprender a hacer algo con las manos"',
      flexibility: "similar",
      priceTier: 2,
    },
  ];

  const createdMayaWishes = [];
  for (const wish of mayaWishes) {
    const created = await prisma.wish.create({
      data: { ...wish, noteId: mayaNote.id },
    });
    createdMayaWishes.push(created);
  }

  const caro = await prisma.guest.create({
    data: { name: "Caro B." },
  });
  const rodrigo = await prisma.guest.create({
    data: { name: "Rodrigo M." },
  });

  const vermut = createdMayaWishes.find(
    (w) => w.title === "Un buen vermut"
  );
  const ceramica = createdMayaWishes.find(
    (w) => w.title === "Clase de cerámica"
  );

  if (vermut) {
    await prisma.guestOnWish.create({
      data: { wishId: vermut.id, guestId: caro.id },
    });
  }
  if (ceramica) {
    await prisma.guestOnWish.create({
      data: { wishId: ceramica.id, guestId: rodrigo.id },
    });
  }

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
