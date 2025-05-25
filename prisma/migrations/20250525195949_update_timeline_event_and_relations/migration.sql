/*
  Warnings:

  - The primary key for the `TimelineEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `characterId` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timelineId` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TimelineEvent` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `TimelineEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `id` on the `TimelineEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `charactersInvolved` to the `TimelineEvent` table without a default value. This is not possible if the table is not empty.
  - Made the column `date` on table `TimelineEvent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `TimelineEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimelineEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "charactersInvolved" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TimelineEvent" ("createdAt", "date", "description", "id", "updatedAt") SELECT "createdAt", "date", "description", "id", "updatedAt" FROM "TimelineEvent";
DROP TABLE "TimelineEvent";
ALTER TABLE "new_TimelineEvent" RENAME TO "TimelineEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
