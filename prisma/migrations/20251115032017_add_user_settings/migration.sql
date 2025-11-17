-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "defaultModel" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "defaultMode" TEXT NOT NULL DEFAULT 'compact',
    "updatedAt" DATETIME NOT NULL
);
