/*
  Warnings:

  - You are about to drop the column `curso` on the `requests` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `requests` table. All the data in the column will be lost.
  - Added the required column `curso` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "curso" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "curso",
DROP COLUMN "quantidade";
