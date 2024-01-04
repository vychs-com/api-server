/*
  Warnings:

  - A unique constraint covering the columns `[project_id,timestamp]` on the table `usage_statistics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "usage_statistics_project_id_timestamp_key" ON "usage_statistics"("project_id", "timestamp");
