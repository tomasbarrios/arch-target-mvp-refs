-- AlterTable
ALTER TABLE "Note" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "Note" ADD COLUMN "eventDate" DATETIME;

-- AlterTable
ALTER TABLE "Wish" ADD COLUMN "flexibility" TEXT;
ALTER TABLE "Wish" ADD COLUMN "priceTier" INTEGER;

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GuestOnWish" (
    "wishId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("wishId", "guestId"),
    CONSTRAINT "GuestOnWish_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GuestOnWish_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestOnWish_wishId_key" ON "GuestOnWish"("wishId");
