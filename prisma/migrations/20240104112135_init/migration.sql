-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "web_url" TEXT,
    "tg_url" TEXT,
    "source_url" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
