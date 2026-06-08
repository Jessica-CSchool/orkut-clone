-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Community" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "creatorSlug" TEXT NOT NULL,
    "dono" TEXT NOT NULL DEFAULT 'Jessica-Lira',
    "idioma" TEXT NOT NULL DEFAULT 'Português',
    "categoria" TEXT NOT NULL DEFAULT 'Outros',
    "tipo" TEXT NOT NULL DEFAULT 'Pública',
    "privacidade" TEXT NOT NULL DEFAULT 'Aberta',
    "forum" TEXT NOT NULL DEFAULT 'Não anônimo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Community" ("createdAt", "creatorSlug", "id", "imageUrl", "title") SELECT "createdAt", "creatorSlug", "id", "imageUrl", "title" FROM "Community";
DROP TABLE "Community";
ALTER TABLE "new_Community" RENAME TO "Community";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
