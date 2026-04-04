/*
  Warnings:

  - You are about to drop the column `endereco` on the `unidade_saude` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "unidade_saude" DROP COLUMN "endereco",
ADD COLUMN     "CEP" INTEGER,
ADD COLUMN     "numero_edificio" INTEGER;
