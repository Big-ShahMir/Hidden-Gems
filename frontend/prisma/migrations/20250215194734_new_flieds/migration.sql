/*
  Warnings:

  - You are about to drop the column `perferences` on the `Preferences` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interests` to the `Preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "interests" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "location" TEXT NOT NULL
);
INSERT INTO "new_Preferences" ("id") SELECT "id" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
