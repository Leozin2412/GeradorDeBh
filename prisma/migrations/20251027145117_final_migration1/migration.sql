-- CreateTable
CREATE TABLE "timesheet" (
    "id" SERIAL NOT NULL,
    "Seguradora" VARCHAR(255),
    "Segurado" VARCHAR(255) NOT NULL,
    "Sinistro" VARCHAR(255),
    "NTradsul" VARCHAR(100) NOT NULL,
    "DtInicial" TIMESTAMP(3) NOT NULL,
    "DtFinal" TIMESTAMP(3) NOT NULL,
    "Descricao" TEXT,
    "TpIncidencia" VARCHAR(255) NOT NULL,
    "Executante" VARCHAR(255) NOT NULL,

    CONSTRAINT "timesheet_pkey" PRIMARY KEY ("id")
);
