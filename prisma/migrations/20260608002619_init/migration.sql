-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubUser" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUser_key" ON "User"("githubUser");
