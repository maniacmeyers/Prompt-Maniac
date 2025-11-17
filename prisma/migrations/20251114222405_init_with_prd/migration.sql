-- AlterTable
ALTER TABLE "Project" ADD COLUMN "prdFileUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "prdRawText" TEXT;

-- CreateTable
CREATE TABLE "PRDSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "rawExcerpt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PRDSection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuildStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "prdSectionId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "todoMarkdown" TEXT NOT NULL,
    "cursorPrompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not started',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuildStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BuildStep_prdSectionId_fkey" FOREIGN KEY ("prdSectionId") REFERENCES "PRDSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
