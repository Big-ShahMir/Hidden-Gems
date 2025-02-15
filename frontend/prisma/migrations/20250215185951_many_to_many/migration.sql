/*
  Warnings:

  - You are about to drop the `_PreferencesToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `perferences` on the `Preferences` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- DropIndex
DROP INDEX "_PreferencesToUser_B_index";

-- DropIndex
DROP INDEX "_PreferencesToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PreferencesToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserPreference" (
    "userId" TEXT NOT NULL,
    "preferenceId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "preferenceId"),
    CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("username") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPreference_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "Preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_Preferences" ("id") SELECT "id" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
