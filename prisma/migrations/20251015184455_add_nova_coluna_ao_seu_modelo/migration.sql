-- CreateTable
CREATE TABLE `timesheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Seguradora` VARCHAR(150) NOT NULL,
    `Segurado` VARCHAR(150) NOT NULL,
    `Sinistro` VARCHAR(100) NOT NULL,
    `NTradsul` VARCHAR(50) NOT NULL,
    `DtInicial` DATETIME(0) NOT NULL,
    `DtFinal` DATETIME(0) NOT NULL,
    `Descricao` TEXT NULL,
    `TpIncidencia` VARCHAR(50) NOT NULL,
    `Executante` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
