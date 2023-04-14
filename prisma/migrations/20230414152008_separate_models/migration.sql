/*
  Warnings:

  - You are about to drop the column `createdAt` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `matricula` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `requests` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "requests_matricula_key";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "createdAt",
DROP COLUMN "matricula",
DROP COLUMN "nome",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_matricula_key" ON "User"("matricula");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
