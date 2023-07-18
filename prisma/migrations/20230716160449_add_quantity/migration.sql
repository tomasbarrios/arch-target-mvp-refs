-- AlterTable
ALTER TABLE "Wish" ADD COLUMN "maxQuantity" INTEGER;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsersOnWishVolunteers" (
    "userId" TEXT NOT NULL,
    "wishId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY ("wishId", "userId"),
    CONSTRAINT "UsersOnWishVolunteers_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnWishVolunteers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UsersOnWishVolunteers" ("assignedAt", "assignedBy", "userId", "wishId") SELECT "assignedAt", "assignedBy", "userId", "wishId" FROM "UsersOnWishVolunteers";
DROP TABLE "UsersOnWishVolunteers";
ALTER TABLE "new_UsersOnWishVolunteers" RENAME TO "UsersOnWishVolunteers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
