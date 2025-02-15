/*
  Warnings:

  - You are about to drop the `_PreferencesToUser` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Preferences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Preferences` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_PreferencesToUser_B_index";

-- DropIndex
DROP INDEX "_PreferencesToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PreferencesToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserPreferences" (
    "userUsername" TEXT NOT NULL,
    "preferencesInterests" TEXT NOT NULL,
    "preferencesBudget" REAL NOT NULL,
    "preferencesLocation" TEXT NOT NULL,

    PRIMARY KEY ("userUsername", "preferencesInterests", "preferencesBudget", "preferencesLocation"),
    CONSTRAINT "UserPreferences_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPreferences_preferencesInterests_preferencesBudget_preferencesLocation_fkey" FOREIGN KEY ("preferencesInterests", "preferencesBudget", "preferencesLocation") REFERENCES "Preferences" ("interests", "budget", "location") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "interests" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "location" TEXT NOT NULL,

    PRIMARY KEY ("interests", "budget", "location")
);
INSERT INTO "new_Preferences" ("budget", "interests", "location") SELECT "budget", "interests", "location" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
