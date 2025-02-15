-- CreateTable
CREATE TABLE "User" (
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
