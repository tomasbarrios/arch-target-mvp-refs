-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "exampleUrls" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT,
    "flaggedAs" TEXT,
    "maxQuantity" INTEGER DEFAULT 1,
    "flexibility" TEXT,
    "priceTier" INTEGER,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Wish_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Wish" ("body", "createdAt", "exampleUrls", "flaggedAs", "flexibility", "id", "maxQuantity", "noteId", "priceTier", "title", "updatedAt") SELECT "body", "createdAt", "exampleUrls", "flaggedAs", "flexibility", "id", "maxQuantity", "noteId", "priceTier", "title", "updatedAt" FROM "Wish";
DROP TABLE "Wish";
ALTER TABLE "new_Wish" RENAME TO "Wish";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
