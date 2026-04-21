/*
  Warnings:

  - You are about to drop the column `retiradas` on the `paciente` table. All the data in the column will be lost.
  - You are about to drop the column `receita_externa` on the `prescricao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_estoque` to the `dispensacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forma_farmaceutica` to the `medicamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `medicamento` table without a default value. This is not possible if the table is not empty.
  - Made the column `cpf` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atribuicao` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comprovante` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_unidade_pertecente` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "CatergoriasMedicamentos" AS ENUM ('HIPERTENSAO', 'DIABETES', 'HIPERDIA');

-- CreateEnum
CREATE TYPE "FormaFarmaceutica" AS ENUM ('ADESIVO', 'AMPOLA', 'ANEL', 'APLICACAO', 'BARRA', 'BASTAO', 'BISNAGA', 'BLISTER', 'BOLSA', 'CAPSULA_INALANTE', 'CARPULE', 'CARTAO', 'CARTELA', 'COMPRIMIDO', 'DOSE', 'DRAGEA', 'EMPLASTRO', 'ENVELOPE');

-- DropForeignKey
ALTER TABLE "paciente" DROP CONSTRAINT "paciente_retiradas_fkey";

-- AlterTable
ALTER TABLE "dispensacao" ADD COLUMN     "id_estoque" UUID NOT NULL,
ADD COLUMN     "id_paciente" UUID;

-- AlterTable
ALTER TABLE "medicamento" DROP COLUMN "forma_farmaceutica",
ADD COLUMN     "forma_farmaceutica" "FormaFarmaceutica" NOT NULL,
DROP COLUMN "categoria",
ADD COLUMN     "categoria" "CatergoriasMedicamentos" NOT NULL;

-- AlterTable
ALTER TABLE "paciente" DROP COLUMN "retiradas";

-- AlterTable
ALTER TABLE "prescricao" DROP COLUMN "receita_externa";

-- AlterTable
ALTER TABLE "unidade_saude" ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "rua" TEXT;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "cpf" SET NOT NULL,
ALTER COLUMN "nome" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "atribuicao" SET NOT NULL,
ALTER COLUMN "comprovante" SET NOT NULL,
ALTER COLUMN "id_unidade_pertecente" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "dispensacao" ADD CONSTRAINT "dispensacao_id_estoque_fkey" FOREIGN KEY ("id_estoque") REFERENCES "estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensacao" ADD CONSTRAINT "dispensacao_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "paciente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
