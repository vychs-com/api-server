/*
  Warnings:

  - Changed the type of `timestamp` on the `usage_statistics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "usage_statistics" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" DECIMAL NOT NULL;

-- CreateIndex
CREATE INDEX "project_id_timestamp" ON "usage_statistics"("project_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "usage_statistics_project_id_timestamp_key" ON "usage_statistics"("project_id", "timestamp");
