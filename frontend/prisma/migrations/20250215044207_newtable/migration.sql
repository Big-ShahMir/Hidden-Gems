-- CreateTable
CREATE TABLE "Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "perferences" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PreferencesToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PreferencesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PreferencesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("username") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PreferencesToUser_AB_unique" ON "_PreferencesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PreferencesToUser_B_index" ON "_PreferencesToUser"("B");
