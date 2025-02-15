/*
  Warnings:

  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `Preferences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `perferences` to the `Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPreference";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_PreferencesToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PreferencesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PreferencesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "perferences" TEXT NOT NULL
);
INSERT INTO "new_Preferences" ("id") SELECT "id" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_PreferencesToUser_AB_unique" ON "_PreferencesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PreferencesToUser_B_index" ON "_PreferencesToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
