-- CreateTable
CREATE TABLE "UsersOnWishVolunteers" (
    "userId" TEXT NOT NULL,
    "wishId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("wishId", "userId"),
    CONSTRAINT "UsersOnWishVolunteers_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnWishVolunteers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
