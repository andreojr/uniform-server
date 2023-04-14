/*
  Warnings:

  - You are about to drop the column `tamanho` on the `requests` table. All the data in the column will be lost.
  - Added the required column `tamanho` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tamanho" CHAR(1) NOT NULL;

-- AlterTable
ALTER TABLE "requests" DROP COLUMN "tamanho";
