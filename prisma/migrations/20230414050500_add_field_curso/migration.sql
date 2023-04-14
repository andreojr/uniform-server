/*
  Warnings:

  - Added the required column `curso` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "curso" TEXT NOT NULL;
