/*
  Warnings:

  - You are about to drop the column `id_estoque` on the `dispensacao` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade_entregue` on the `dispensacao` table. All the data in the column will be lost.
  - You are about to drop the column `forma_farmaceutica` on the `medicamento` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UnidadeMedida" AS ENUM ('COMPRIMIDO', 'CAPSULA', 'FRASCO', 'AMPOLA', 'BISNAGA', 'ENVELOPE', 'CANETA', 'UNIDADE');

-- DropForeignKey
ALTER TABLE "dispensacao" DROP CONSTRAINT "dispensacao_id_estoque_fkey";

-- AlterTable
ALTER TABLE "dispensacao" DROP COLUMN "id_estoque",
DROP COLUMN "quantidade_entregue";

-- AlterTable
ALTER TABLE "medicamento" DROP COLUMN "forma_farmaceutica",
ADD COLUMN     "unidade_medida" "UnidadeMedida" NOT NULL DEFAULT 'COMPRIMIDO';

-- DropEnum
DROP TYPE "FormaFarmaceutica";

-- CreateTable
CREATE TABLE "item_dispensado" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_dispensacao" UUID NOT NULL,
    "id_estoque" UUID NOT NULL,
    "quantidade" INTEGER NOT NULL,

    CONSTRAINT "item_dispensado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_dispensado" ADD CONSTRAINT "item_dispensado_id_dispensacao_fkey" FOREIGN KEY ("id_dispensacao") REFERENCES "dispensacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_dispensado" ADD CONSTRAINT "item_dispensado_id_estoque_fkey" FOREIGN KEY ("id_estoque") REFERENCES "estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
