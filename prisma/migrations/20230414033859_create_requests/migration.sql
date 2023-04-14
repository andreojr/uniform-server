-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tamanho" CHAR(1) NOT NULL,
    "cor" TEXT NOT NULL,
    "quantidade" SMALLINT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "requests_email_key" ON "requests"("email");
