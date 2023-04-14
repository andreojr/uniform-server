/*
  Warnings:

  - You are about to drop the column `email` on the `requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matricula]` on the table `requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "requests_email_key";

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "email",
ADD COLUMN     "matricula" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "requests_matricula_key" ON "requests"("matricula");
