-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "pay" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "modelo" SET DEFAULT 'codigo';
