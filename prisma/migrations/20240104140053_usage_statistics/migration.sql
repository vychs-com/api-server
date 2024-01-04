-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "usage_statistics" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "usage_statistics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "usage_statistics" ADD CONSTRAINT "usage_statistics_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
