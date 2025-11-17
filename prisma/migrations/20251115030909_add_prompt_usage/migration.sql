-- CreateTable
CREATE TABLE "PromptUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "sessionId" TEXT,
    "model" TEXT NOT NULL,
    "promptMode" TEXT NOT NULL DEFAULT 'compact',
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "estimatedCost" REAL NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
